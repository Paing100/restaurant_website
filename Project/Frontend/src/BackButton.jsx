import Button from "@mui/material/Button";

function BackButton() {
  return(
      <Button
        onClick={() => window.history.back()}
        sx={{
          position: "absolute",
          top: "100px",
          left: "30px",
          backgroundColor: "#333",
          color: "white",
          "&:hover": {
            backgroundColor: "darkgray",
          },
        }}
      >       
      ← Back
      </Button>
  );
}

export default BackButton;