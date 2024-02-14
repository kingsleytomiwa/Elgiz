"use client"
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";
import { SessionProvider } from "next-auth/react";
import ThemeRegistry from "src/app/ThemeRegistry";
import { SWRConfig } from "swr";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <SWRConfig value={{ provider: () => new Map() }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeRegistry options={{ key: "mui" }}>
            {children}
          </ThemeRegistry>
        </LocalizationProvider>
      </SWRConfig>
    </SessionProvider>
  )
}

export default Provider
