import spinnerIcon from "../../assets/infinite-spinner.svg";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <img
        src={spinnerIcon}
        alt="Loading"
        style={{
          width: "170px",
          height: "170px",
          marginBottom: "1rem",
        }}
      />
    </div>
  );
};

export default Loading;
