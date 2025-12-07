import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const Checkbox = React.forwardRef<HTMLInputElement, Props>(({ className = "", ...rest }, ref) => {
  return (
    <input
      ref={ref}
      type="checkbox"
      {...rest}
      className={`h-4 w-4 rounded-sm border-gray-300 text-black focus:ring-0 ${className}`}
      // use accent-color so checked box is black in supporting browsers
      style={{ accentColor: "#000" }}
    />
  );
});

Checkbox.displayName = "Checkbox";
export default Checkbox;