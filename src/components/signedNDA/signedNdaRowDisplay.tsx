import Swal from "sweetalert2";
import { motion } from "framer-motion";
import signedNdaAPI from "../../api/signedNdaApi/signedNdaAPI";
import type { NdaDocument } from "../../types/user";

interface Props {
  data: NdaDocument[];
  onEdit: (nda: NdaDocument) => void;
  fetchNdaDocs: () => Promise<void>;
}

export default function SignedNdaRowDisplay({
  data,
  onEdit,
  fetchNdaDocs,
}: Props) {
  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the NDA",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16968F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await signedNdaAPI.DeleteNDA(id);
        await fetchNdaDocs();
        Swal.fire({
          text: "NDA deleted successfully!",
          icon: "success",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          text: "Delete failed. Try again later.",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="bg-white rounded-b-lg shadow-lg overflow-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 text-[#8B8B8B] text-base leading-relaxed border-b border-[#D0D0D0] sticky top-0 z-10">
          <tr>
            <th className="p-4 font-normal">Uploaded NDA&apos;s</th>
            <th className="p-4 font-normal">Uploaded Date</th>
            <th className="p-4 font-normal text-center">Action</th>
          </tr>
        </thead>

        <motion.tbody
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="text-center text-red-500 font-medium text-lg py-6"
              >
                No NDA records found!
              </td>
            </tr>
          ) : (
            data.map((nda: NdaDocument) => (
              <motion.tr
                key={nda._id}
                variants={rowVariants}
                transition={{ duration: 0.4, ease: "easeOut" }}
                whileHover={{
                  scale: 1.0,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                className="border-t border-[#CDCDCD]"
              >
                <td className="p-4">
                  <a
                    href={nda.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 truncate max-w-[300px]"
                  >
                    {nda.fileUrl.split("/").pop()}
                  </a>
                </td>

                <td className="p-4">
                  {nda.createdAt
                    ? new Date(nda.createdAt).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-4 text-center flex items-center justify-center space-x-3">
                  <button onClick={() => onEdit(nda)}>
                    <img
                      src="/icons/edit-icon.svg"
                      alt="Edit"
                      width={18}
                      height={18}
                    />
                  </button>
                  <button onClick={() => handleDelete(nda._id)}>
                    <img
                      src="/icons/delete-icon.svg"
                      alt="Delete"
                      width={15}
                      height={15}
                    />
                  </button>
                </td>
              </motion.tr>
            ))
          )}
        </motion.tbody>
      </table>
    </div>
  );
}
