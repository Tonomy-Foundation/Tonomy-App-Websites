import "./TextboxLayout.css";

export type TextboxLayoutProps = {
  label: string;
  value: string;
  onChange?: (value: string) => void;
};

const TextboxLayout = (props: TextboxLayoutProps) => {
  return (
    <div className="input-container">
      <input
        type="text"
        className="transparent-textbox"
        id="inputField"
        value={props.value || ""}
        onChange={(e) => {
          if (props.onChange) props.onChange(e.target.value);
        }}
      />
      <label htmlFor="inputField" className="textbox-label">
        tes
      </label>
    </div>
  );
};

export default TextboxLayout;
