import { useState } from 'react'
import { X, Lock, Download } from 'lucide-react'
import { useVault } from '../hooks/useVault'
import toast from 'react-hot-toast'

export default function DecryptModal({ file, onClose }) {
  const { retrieveAndDecryptFile, loading } = useVault()
  const [decrypted, setDecrypted] = useState(null)

  async function handleDecrypt() {
    try {
      toast('Sign your wallet to decrypt', { icon: '🔐' })
      const result = await retrieveAndDecryptFile(file.encryptedArweaveId)
      setDecrypted(result)
    } catch (error) {
      toast.error('Decryption failed. Make sure you are connected with the right wallet.')
    }
  }

  function handleDownload() {
    if (!decrypted) return
    const a = document.createElement('a')
    a.href = decrypted.url
    a.download = decrypted.fileName
    a.click()
  }

  function handleClose() {
    decrypted?.cleanup?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-elevated border border-border rounded-2xl w-full max-w-lg animate-slide-up">

        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-purple-400" />
            <h2 className="font-display text-lg font-semibold text-text-primary">{file.fileName}</h2>
          </div>
          <button onClick={handleClose} className="text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {!decrypted ? (
            <div className="text-center py-6">
              <div className="h-16 w-16 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={28} className="text-purple-400" />
              </div>
              <p className="font-body text-text-secondary text-sm mb-6 leading-relaxed">
                This file is encrypted. Sign your wallet to prove ownership and decrypt it.
                The file will only be visible temporarily — it is never permanently decrypted.
              </p>
              <button
                onClick={handleDecrypt}
                disabled={loading}
                className="flex items-center gap-2 bg-purple-500 text-white px-6 py-3 rounded-xl font-display font-semibold text-sm hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mx-auto"
              >
                <Lock size={16} />
                {loading ? 'Decrypting...' : 'Sign to Decrypt'}
              </button>
            </div>
          ) : (
            <div>
              {decrypted.fileType.startsWith('image/') && (
                <img src={decrypted.url} alt={decrypted.fileName} className="w-full rounded-xl mb-4 max-h-96 object-contain" />
              )}
              {decrypted.fileType === 'application/pdf' && (
                <iframe src={decrypted.url} className="w-full h-64 rounded-xl mb-4" title={decrypted.fileName} />
              )}
              {!decrypted.fileType.startsWith('image/') && decrypted.fileType !== 'application/pdf' && (
                <div className="bg-card border border-border rounded-xl p-8 text-center mb-4">
                  <p className="font-body text-text-secondary text-sm">File decrypted successfully. Download to view.</p>
                </div>
              )}
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 bg-purple-500 text-white py-3 rounded-xl font-display font-semibold text-sm hover:bg-purple-400 transition-colors"
              >
                <Download size={16} />
                Download {decrypted.fileName}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
