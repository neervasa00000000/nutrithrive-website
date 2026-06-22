import { useState } from 'react'
import { useWriteContract, useChainId, useAccount } from 'wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import { wagmiConfig } from '../config/wagmi'
import { CONTRACT_ADDRESSES } from '../config/contracts'
import VaultRegistryABI from '../contracts/VaultRegistry.json'
import { useArweave } from './useArweave'
import { useLit } from './useLit'

const ZERO = '0x0000000000000000000000000000000000000000'

export function useVault() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { uploadToArweave, fetchFromArweave } = useArweave()
  const { encryptFile, decryptFile } = useLit()
  const { writeContractAsync } = useWriteContract()
  const [loading, setLoading] = useState(false)

  async function storeFile(file) {
    setLoading(true)
    try {
      if (!isConnected || !address) throw new Error('WALLET_NOT_CONNECTED')
      if (chainId !== 84532) throw new Error('WRONG_NETWORK')
      if (CONTRACT_ADDRESSES.VaultRegistry === ZERO) {
        throw new Error('CONTRACTS_NOT_DEPLOYED')
      }

      const encrypted = await encryptFile(file)

      const encryptedPayload = JSON.stringify({
        ciphertext: encrypted.ciphertext,
        dataToEncryptHash: encrypted.dataToEncryptHash,
        accessControlConditions: encrypted.accessControlConditions,
        originalFileName: encrypted.originalFileName,
        originalFileType: encrypted.originalFileType,
        originalFileSize: encrypted.originalFileSize,
      })

      const arweaveId = await uploadToArweave(encryptedPayload, 'application/json')

      const fileType = file.type.startsWith('image/') ? 'image'
        : file.type.startsWith('video/') ? 'video'
        : file.type === 'application/pdf' ? 'document'
        : 'other'

      const conditionsHash = JSON.stringify(encrypted.accessControlConditions)
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.VaultRegistry,
        abi: VaultRegistryABI.abi,
        functionName: 'storeFile',
        args: [arweaveId, file.name, fileType, conditionsHash],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })
      return { success: true, arweaveId }
    } catch (error) {
      console.error('Vault store failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  async function retrieveAndDecryptFile(arweaveId) {
    setLoading(true)
    try {
      const response = await fetchFromArweave(arweaveId)
      const payload = await response.json()

      const decryptedBytes = await decryptFile(payload, payload.accessControlConditions)

      const blob = new Blob([decryptedBytes], { type: payload.originalFileType })
      const url = URL.createObjectURL(blob)

      return {
        url,
        fileName: payload.originalFileName,
        fileType: payload.originalFileType,
        cleanup: () => URL.revokeObjectURL(url),
      }
    } catch (error) {
      console.error('Vault retrieve failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { storeFile, retrieveAndDecryptFile, loading }
}
