import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface Option {
  value: string;
  label: string;
}

interface FilterListboxProps {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  placeholder: string;
}

function CandidateFilterListbox({
  value,
  onChange,
  options,
  placeholder,
}: FilterListboxProps) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="flex items-center text-sm cursor-pointer px-3 py-2 rounded-lg bg-white focus:outline-none">
          <span>
            {options.find((opt) => opt.value === value)?.label || placeholder}
          </span>
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </Listbox.Button>

        <Listbox.Options className="absolute z-10 mt-2 w-52 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none">
          {options.map((opt) => (
            <Listbox.Option
              key={opt.value}
              value={opt.value}
              className={({ active }) =>
                `cursor-pointer select-none px-4 py-2 ${
                  active ? "bg-teal-100 text-teal-700" : "text-gray-700"
                }`
              }
            >
              {opt.label}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}

export default CandidateFilterListbox;
