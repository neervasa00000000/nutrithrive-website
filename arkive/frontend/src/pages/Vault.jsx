import { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { Upload, Lock } from 'lucide-react'
import { CONTRACT_ADDRESSES } from '../config/contracts'
import VaultRegistryABI from '../contracts/VaultRegistry.json'
import VaultFileCard from '../components/VaultFileCard'
import UploadModal from '../components/UploadModal'

export default function Vault() {
  const { address } = useAccount()
  const [showUpload, setShowUpload] = useState(false)

  const { data: files, refetch } = useReadContract({
    address: CONTRACT_ADDRESSES.VaultRegistry,
    abi: VaultRegistryABI.abi,
    functionName: 'getMyFiles',
    account: address,
  })

  return (
    <div className="max-w-3xl mx-auto">

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lock size={20} className="text-purple-400" />
            <h1 className="font-display text-2xl font-bold text-text-primary">Vault</h1>
          </div>
          <p className="font-body text-text-secondary text-sm">
            Files encrypted with your wallet. Only you can open them. Stored on Arweave forever.
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2.5 rounded-xl font-display font-semibold text-sm hover:bg-purple-400 transition-colors"
        >
          <Upload size={18} />
          Store File
        </button>
      </div>

      <div className="bg-card border border-purple-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
        <div className="mt-0.5">
          <Lock size={16} className="text-purple-400" />
        </div>
        <p className="font-body text-text-secondary text-sm leading-relaxed">
          Files are encrypted before leaving your device. Your wallet signature is the only key.
          If this app disappears, your seed phrase unlocks everything permanently via Arweave.
        </p>
      </div>

      {!files || files.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Lock size={32} className="text-text-muted mx-auto mb-4" />
          <p className="font-body text-text-secondary mb-2">Your vault is empty</p>
          <p className="font-body text-text-muted text-sm">Upload any file. It will be encrypted and stored permanently.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <VaultFileCard
              key={file.id.toString()}
              file={file}
              onDeleted={refetch}
            />
          ))}
        </div>
      )}

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={() => { setShowUpload(false); refetch() }}
        />
      )}
    </div>
  )
}
