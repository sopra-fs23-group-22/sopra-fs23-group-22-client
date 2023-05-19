import PropTypes from "prop-types";
import "../../styles/ui/FormField.scss";

export const FormField = (props) => {
  return (
    <div className="form-field field">
      <label className="form-field label">{props.label}</label>
      <input
        type={props.type}
        className="form-field input"
        placeholder="Please enter here"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};
