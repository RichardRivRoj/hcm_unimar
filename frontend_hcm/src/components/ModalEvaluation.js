import { motion } from 'framer-motion'
import { Dialog } from '@headlessui/react'

const ModalEvaluation = ({ children, title, onClose }) => (
  <Dialog open={true} onClose={onClose} className="relative z-50">
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 flex items-center justify-center p-4"
    >
      <Dialog.Panel className="flex flex-col w-full h-full bg-white rounded-none shadow-2xl">
        <div className="p-8 border-b border-gray-200">
          <Dialog.Title className="text-3xl font-bold text-[#004b9a]">
            {title}
          </Dialog.Title>
        </div>
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </Dialog.Panel>
    </motion.div>
  </Dialog>
)

export default ModalEvaluation