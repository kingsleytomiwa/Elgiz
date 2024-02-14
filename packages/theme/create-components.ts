import {
  Components,
  Theme,
  createTheme,
  filledInputClasses,
  inputLabelClasses,
  outlinedInputClasses,
  paperClasses,
  tableCellClasses,
} from "@mui/material";

// Used only to create transitions
const muiTheme = createTheme();

export function createComponents(config) {
  const { palette } = config;

  return {
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
        },
        sizeSmall: {
          padding: "6px 16px",
        },
        sizeMedium: {
          padding: "8px 20px",
        },
        sizeLarge: {
          padding: "11px 24px",
        },
        textSizeSmall: {
          padding: "7px 12px",
        },
        textSizeMedium: {
          padding: "9px 16px",
        },
        textSizeLarge: {
          padding: "12px 16px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          [`&.${paperClasses.elevation1}`]: {
            boxShadow: "0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)",
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "32px 24px",
          "&:last-child": {
            paddingBottom: "32px",
          },
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: "h6",
        },
        subheaderTypographyProps: {
          variant: "body2",
        },
      },
      styleOverrides: {
        root: {
          padding: "32px 24px 16px",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },
        html: {
          MozOsxFontSmoothing: "grayscale",
          WebkitFontSmoothing: "antialiased",
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          width: "100%",
        },
        body: {
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          minHeight: "100%",
          width: "100%",
        },
        "#__next": {
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        },
        "#nprogress": {
          pointerEvents: "none",
        },
        "#nprogress .bar": {
          backgroundColor: palette.primary.main,
          height: 3,
          left: 0,
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 2000,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: "56px",
        },
        input: {
          cursor: "pointer",
          "&::placeholder": {
            opacity: 1,
            color: "#9EA5AD",
            mr: 2,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        input: {
          fontSize: 16,
          fontWeight: 400,
          lineHeight: "24px",
          borderColor: "#00000080",
          "&::placeholder": {
            color: palette.text.secondary,
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          borderRadius: 8,
          borderStyle: "solid",
          borderWidth: 1,
          overflow: "hidden",
          borderColor: palette.neutral[500],
          transition: muiTheme.transitions.create(["border-color", "box-shadow"]),
          // "&:hover": {
          //   backgroundColor: palette.action.hover,
          // },
          "&:before": {
            display: "none",
          },
          "&:after": {
            display: "none",
          },
          [`&.${filledInputClasses.disabled}`]: {
            backgroundColor: "transparent",
          },
          [`&.${filledInputClasses.focused}`]: {
            backgroundColor: "transparent",
            borderColor: palette.primary.main,
            boxShadow: `${palette.primary.main} 0 0 0 2px`,
          },
          [`&.${filledInputClasses.error}`]: {
            borderColor: palette.error.main,
            boxShadow: `${palette.error.main} 0 0 0 2px`,
          },
        },
        input: {
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 400,
          lineHeight: "24px",
          "&:: placeholder": {
            color: "#9EA5AD",
            mr: 2,
            boxShadow: "none",
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginRight: 0,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          cursor: "pointer",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          border: "1px solid #00000080",
          borderRadius: 8,
          height: "56px",
          "&:: placeholder": {
            color: "#9EA5AD",
            mr: 2,
            boxShadow: "none",
          },
          [`& .${outlinedInputClasses.notchedOutline}`]: {
            display: "none",
          },
          "&:hover": {
            backgroundColor: palette.action.hover,
            // [`& .${outlinedInputClasses.notchedOutline}`]: {
            //   borderColor: palette.neutral[200],
            // },
          },
          [`&.${outlinedInputClasses.focused}`]: {
            backgroundColor: "transparent",
            // [`& .${outlinedInputClasses.notchedOutline}`]: {
            //   borderColor: palette.primary.main,
            // },
          },
          [`&.${filledInputClasses.error}`]: {
            // [`& .${outlinedInputClasses.notchedOutline}`]: {
            //   borderColor: palette.error.main,
            // },
          },
        },
        input: {
          borderColor: "#00000080",
          fontSize: 16,
          fontWeight: 400,
          lineHeight: "24px",
        },
        // notchedOutline: {
        //   transition: muiTheme.transitions.create([
        //     "border-color",
        //     "box-shadow",
        //   ]),
        // },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: "30px",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: palette.neutral[500],
          fontSize: 16,
          fontWeight: 400,
          lineHeight: "24px",
          [`&.${inputLabelClasses.filled}`]: {
            transform: "translate(12px, 18px) scale(1)",
          },
          [`&.${inputLabelClasses.shrink}`]: {
            [`&.${inputLabelClasses.standard}`]: {
              transform: "translate(0, -1.5px) scale(0.85)",
              background: "white",
              paddingLeft: "4px",
              paddingRight: "4px",
            },
            [`&.${inputLabelClasses.filled}`]: {
              transform: "translate(12px, 6px) scale(0.85)",
            },
            [`&.${inputLabelClasses.outlined}`]: {
              transform: "translate(14px, -7px) scale(0.75)",
              background: "white",
              paddingLeft: "4px",
              paddingRight: "4px",
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: 1.71,
          minWidth: "auto",
          paddingLeft: 0,
          paddingRight: 0,
          textTransform: "none",
          "& + &": {
            marginLeft: 0,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: palette.divider,
          padding: "15px 16px",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          borderBottom: "none",
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
            backgroundColor: palette.neutral[50],
            color: palette.neutral[700],
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          },
          [`& .${tableCellClasses.paddingCheckbox}`]: {
            paddingTop: 4,
            paddingBottom: 4,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "filled",
      },
    },
  } as Components<Omit<Theme, "components">>;
}
