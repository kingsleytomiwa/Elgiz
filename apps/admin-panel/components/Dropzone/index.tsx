import { Box, Button } from "@mui/material";

interface Props {
  label: string;
  onChange: (event) => {};
}

const Dropzone: React.FC<Props> = ({ label, onChange }) => {
  return (
    <Box sx={{ width: "100px", position: "relative", cursor: "pointer" }}>
      <Button
        sx={{
          p: 0,
          borderBottom: "1px solid #3F51B5",
          borderRadius: "0",
          lineHeight: "21px",
          cursor: "pointer",
          fontWeight: "400",
          color: "#3F51B5",
        }}
      >
        {label}
      </Button>
      <input
        onChange={onChange}
        type="file"
        style={{
          opacity: 0,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          cursor: "pointer",
        }}
      />
    </Box>
  );
};

export default Dropzone;
