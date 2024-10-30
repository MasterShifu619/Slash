import React, { useState } from "react";
import {
  Button,
  Stack,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import getResults from "../util";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";

function Menu() {
  const navigate = useNavigate();
  const [buttonState, setButtonState] = useState("Default");
  const [searchItem, setSearchItem] = useState("");
  const [searchWeb, setSearchWeb] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    setLoading(true);
    let result = null;
    try {
      result = await getResults(searchWeb, searchItem);
      navigate("/results", { state: { response: result } });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setButtonState("Fetched");
    }
  };

  const handleSubmission = () => {
    if (searchItem && searchWeb) {
      setButtonState("Fetching");
      fetchResults();
    } else {
      alert("Please fill out both fields before searching.");
    }
  };

  const handleClear = () => {
    setSearchItem("");
    setSearchWeb("");
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      paddingBottom: "60px",
    }}>
      <Card
        variant="outlined"
        sx={{
          width: 400, // Set a fixed width
          height: 'auto', // Allow height to adjust based on content
          borderRadius: '8px', // Slightly rounded corners for aesthetic
          display: 'flex',
          flexDirection: 'column', // Stack children vertically
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          backgroundColor: 'white',
          border: '4px solid RoyalBlue',
          marginTop: '-270px',
          padding: 2, // Add some padding
        }}
      >
        <CardContent>
          <Stack direction="column" alignItems="center" spacing={3}>
            <Typography variant="h5" sx={{ marginBottom: 2, color: '#4169E1', fontSize: '1.8rem',fontWeight: 'bold' }}>
              SLASH IT!
            </Typography>
            <TextField
    
              id="outlined-basic"
              label="Enter the Item"
              variant="outlined"
              size="small"
              width = "200"
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              InputProps={{
                sx: {
                  width: '50',
                  color: 'black',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4169E1',
                  },
                }
              }}
              InputLabelProps={{
                sx: {
                  color: 'black',
                }
              }}
            />
            <FormControl fullWidth variant="outlined" size="small" sx={{ borderColor: 'black' }}>
              <InputLabel id="website-select-label" sx={{ color: 'black' }}>Choose the Website</InputLabel>
              <Select
                labelId="website-select-label"
                value={searchWeb}
                label="Choose the Website"
                onChange={(e) => setSearchWeb(e.target.value)}
                sx={{
                  color: 'black',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4169E1',
                  }
                }}
              >
                <MenuItem value="az">Amazon</MenuItem>
                <MenuItem value="wm">Walmart</MenuItem>
                <MenuItem value="eb">Ebay</MenuItem>
                <MenuItem value="cc">Costco</MenuItem>
                <MenuItem value="tg">Target</MenuItem>
                <MenuItem value="bb">BestBuy</MenuItem>
                <MenuItem value="thd">The Home Depot</MenuItem>
                <MenuItem value="all">All</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="column" alignItems="center" spacing={2} sx={{ marginTop: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmission}
              sx={{ width: "150px" }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon sx={{ marginRight: 1 }} />}
              Search
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClear}
              sx={{ width: "150px", marginTop: 1 }}
              startIcon={<ClearIcon />}
            >
              CLEAR
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <footer style={{
        backgroundColor: "#4169E1",
        color: "white",
        width: "100%",
        textAlign: "center",
        padding: "10px 0",
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 1000
      }}>
      </footer>
    </div>
  );
}

export default Menu;
