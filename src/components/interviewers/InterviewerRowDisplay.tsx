import Swal from "sweetalert2";
import { motion } from "framer-motion";
import type { Interviewer } from "../../types/user";
import InterviewerAPI from "../../api/interviewersApi/InterviewersAPI";

interface Props {
  data: Interviewer[];
  onEdit: (interviewer: Interviewer) => void;
  fetchInterviewers: () => Promise<void>;
}

export default function InterviewerRowDisplay({
  data,
  onEdit,
  fetchInterviewers,
}: Props) {
  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16968F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await InterviewerAPI.DeleteInterviewer(id);
        await fetchInterviewers();
        Swal.fire({
          text: "Interviewer has been Deleted!",
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
          text: "Something went wrong.",
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

  function capitalizeFirstLetter(value: string | undefined | null): string {
    if (!value) return "-";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  return (
    <div className="bg-white rounded-b-lg shadow-lg overflow-auto">
      {data.length === 0 ? (
        <div className="flex justify-center items-center min-h-[150px]">
          <p className="text-red-500 font-medium text-lg">
            No Interviewers found!
          </p>
        </div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-[#8B8B8B] text-zinc-500 text-base leading-relaxed border-b border-[#D0D0D0]">
            <tr>
              <th className="p-4 font-normal">Interviewer Name</th>
              <th className="p-4 font-normal">Email</th>
              <th className="p-4 font-normal">Department</th>
              <th className="p-4 font-normal text-center">Action</th>
            </tr>
          </thead>

          <motion.tbody
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {data.map((interviewer: Interviewer) => (
              <motion.tr
                key={interviewer._id}
                variants={rowVariants}
                transition={{ duration: 0.4, ease: "easeOut" }}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                className="border-b border-[#CDCDCD] cursor-pointer"
              >
                <td className="p-4">
                  {capitalizeFirstLetter(interviewer.name)}
                </td>
                <td className="p-4">
                  {capitalizeFirstLetter(interviewer.email)}
                </td>
                <td className="p-4">
                  {capitalizeFirstLetter(interviewer.designation)}
                </td>
                <td className="p-4 text-center flex items-center justify-center space-x-3">
                  <button onClick={() => onEdit(interviewer)}>
                    <img
                      src="/icons/edit-icon.svg"
                      alt="Edit"
                      width={18}
                      height={18}
                    />
                  </button>
                  <button onClick={() => handleDelete(interviewer._id)}>
                    <img
                      src="/icons/delete-icon.svg"
                      alt="Delete"
                      width={15}
                      height={15}
                    />
                  </button>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      )}
    </div>
  );
}
