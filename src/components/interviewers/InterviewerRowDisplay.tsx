import Swal from "sweetalert2";
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
          icon: "success",
          title: "Deleted!",
          text: "Interviewer has been deleted.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err: any) {
        Swal.fire({
          icon: "error",
          title: "Error deleting interviewer",
          text: "Something went wrong.",
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-b-lg shadow-lg overflow-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 text-[#8B8B8B] uppercase text-sm">
          <tr>
            <th className="p-4 font-medium">Name</th>
            <th className="p-4 font-medium">Email</th>
            <th className="p-4 font-medium">Department</th>
            <th className="p-4 font-medium">Last Updated</th>
            <th className="p-4 font-medium text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((interviewer: Interviewer, i: number) => (
            <tr key={i} className="border-b border-[#CDCDCD] hover:bg-gray-50">
              <td className="p-4">{interviewer.name}</td>
              <td className="p-4">{interviewer.email}</td>
              <td className="p-4">{interviewer.designation}</td>
              <td className="p-4">
                {interviewer.updatedAt?.split("T")[0] ?? "-"}
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
                <button onClick={() => handleDelete(interviewer.id)}>
                  <img
                    src="/icons/delete-icon.svg"
                    alt="Delete"
                    width={15}
                    height={15}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
