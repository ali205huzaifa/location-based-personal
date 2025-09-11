import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import type { Department, ModalMode, Skill } from "../../types/user";
import deptSkillsAPI from "../../api/deptSkillsApi/deptSkillsAPI";

const MySwal = withReactContent(Swal);

const input =
  "w-full rounded-md border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";

type Base = {
  open: boolean;
  mode: ModalMode;
  onClose: () => void;
  onSuccess: () => void;
};

type DeptProps = Base & {
  type: "department";
  initial?: Partial<Department> & { id?: string };
};

type SkillProps = Base & {
  type: "skill";
  departments: Department[];
  initial?: Partial<Skill> & { id?: string };
};

export type CreateDeptSkillModalProps = DeptProps | SkillProps;

export default function CreateDeptSkillModal(props: CreateDeptSkillModalProps) {
  const { open, onClose, onSuccess, mode } = props;

  const [deptName, setDeptName] = useState("");
  const [skillName, setSkillName] = useState("");
  const [skillDeptId, setSkillDeptId] = useState("");
  const [labelDescription, setLabelDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (props.type === "department") {
      setDeptName(props.initial?.name || "");
      setLabelDescription(props.initial?.description || "");
    } else {
      setSkillName(props.initial?.name || "");
      setSkillDeptId(
        typeof props.initial?.departmentId === "object"
          ? (props.initial?.departmentId as any)._id
          : (props.initial?.departmentId as string) || ""
      );
    }
  }, [open]);

  const title = useMemo(() => {
    const noun = props.type === "department" ? "Department" : "Skill";
    const verb = mode === "create" ? "Add" : "Edit";
    return `${verb} ${noun}`;
  }, [props.type, mode]);

  if (!open) return null;

  const submit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (props.type === "department") {
        if (!deptName.trim()) {
          await MySwal.fire({
            icon: "warning",
            text: "Department name is required.",
            toast: true,
            position: "top-right",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          return;
        }
        if (mode === "create")
          await deptSkillsAPI.Createdept({
            name: deptName.trim(),
            description: labelDescription.trim(),
          });
        else
          await deptSkillsAPI.Updatedept(String(props.initial?._id), {
            name: deptName.trim(),
            description: labelDescription.trim(),
          });
      } else {
        if (!skillName.trim() || !skillDeptId) {
          await MySwal.fire({
            icon: "warning",
            text: "Skill name and department are required.",
            toast: true,
            position: "top-right",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          return;
        }
        if (mode === "create") {
          await deptSkillsAPI.Createskills({
            name: skillName.trim(),
            departmentId: skillDeptId,
          });
        } else {
          await deptSkillsAPI.Updateskills(String(props.initial?._id), {
            name: skillName.trim(),
            departmentId: skillDeptId,
          });
        }
      }

      MySwal.fire({
        icon: "success",
        title: "Saved",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      onClose();
      onSuccess();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong";
      await MySwal.fire({ icon: "error", title: "Error", text: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-black text-lg font-normal">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-gray-100"
          >
            <img
              src="/icons/cross-icon.svg"
              alt="Close modal"
              width={15}
              height={15}
            />
          </button>
        </div>

        {props.type === "department" ? (
          <div className="space-y-4">
            <div>
              <input
                className={input}
                placeholder="Enter Department Name"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
              />
            </div>

            <div>
              <textarea
                className={input}
                placeholder="Enter Description for Department"
                value={labelDescription}
                onChange={(e) => setLabelDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <input
                className={input}
                placeholder="Skill Name"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
              />
            </div>
            <div>
              <select
                className={input}
                value={skillDeptId}
                onChange={(e) => setSkillDeptId(e.target.value)}
              >
                <option value="" disabled>
                  Select Department
                </option>
                {Array.isArray(props.departments) &&
                  props.departments.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-start gap-2">
          <button
            onClick={submit}
            disabled={loading}
            className={`rounded-md px-10 py-2 text-xs font-normal text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#16968F] hover:bg-emerald-700"
            }`}
          >
            {loading
              ? mode === "create"
                ? "Adding..."
                : "Updating..."
              : mode === "create"
              ? "Add"
              : "Update"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-gray-300 px-8 py-2 text-black text-xs font-normal disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
