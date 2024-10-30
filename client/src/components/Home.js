import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
} from '@mui/material';

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    color: '#1976D2', // Adjust link color as needed
  },
  image: {
    maxWidth: '100%',
    maxHeight: '150px', // Adjust maximum height as needed
  },
  refreshButton: {
    marginLeft: '8px',
  },
  tableContainer: {
    width: '80%',
    margin: 'auto',
    overflowX: 'auto',
    marginTop: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f2f2f2',
    padding: '12px',
    textAlign: 'left',
    textTransform: 'capitalize',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
    textTransform: 'capitalize',
  },
  removeButton: {
    marginLeft: '8px',
  },
});

export default function Home() {
  const classes = useStyles();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    // Load wishlist items when component mounts
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      const response = await fetch('http://localhost:2000/api/getWishlistItems');
      const data = await response.json();
      setWishlistItems(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleRemove = async (item) => {
    try {
      await fetch('http://localhost:2000/api/removeWishlistItem', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item)
      });
      fetchWishlistItems(); // Refresh the list after removal
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <Grid container>
      {wishlistItems.length > 0 && (
        <div className={classes.tableContainer}>
          <h2> My Wishlist </h2>
          <table className={classes.table}>
            <thead>
              <tr>
                {Object.keys(wishlistItems[0]).map((key) => key !== 'id' && key !== 'user_id' && (
                  <th key={key} className={classes.th}>{key === 'link' ? 'Get Link' : key}</th>
                ))}
                <th className={classes.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {wishlistItems.map((item) => (
                <tr key={item.id}>
                  {Object.entries(item).map(([key, value]) => {
                    if (key !== 'id' && key !== 'user_id') {
                      return (
                        <td key={key} className={classes.td}>
                          {key === 'image' ? (
                            <img src={value} alt={item.title} style={{ width: '50px' }} />
                          ) : key === 'link' ? (
                            <a href={value} target="_blank" rel="noopener noreferrer">View</a>
                          ) : (
                            value
                          )}
                        </td>
                      );
                    }
                    return null;
                  })}
                  <td className={classes.td}>
                    <Button onClick={() => handleRemove(item)}>Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Grid>
  );
}
