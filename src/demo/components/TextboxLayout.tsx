import "./TextboxLayout.css";

export type TextboxLayoutProps = {
  label: string;
  value: string;
};

const TextboxLayout = (props: TextboxLayoutProps) => {
  return (
    <div className="input-container">
      <input
        type="text"
        className="transparent-textbox"
        id="inputField"
        value={props.value}
      />
      <label htmlFor="inputField" className="textbox-label">
        {props.label}
      </label>
    </div>
  );
};

export default TextboxLayout;
