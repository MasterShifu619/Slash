import React from "react";
import { makeStyles } from "@mui/styles";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useCart } from './Cart';
// import AddToWishlist from './AddToWishlist';

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

const hardcodedCartData = [
  {
    title: "61 Key Music Electronic Keyboard Electri...",
    price: "$87.58",
    website: "ebay",
    link: "https://www.ebay.com/itm/61-Key-Music-Electronic-Keyboard-Electric-Digital-Piano-Organ-Stand-/254803804078",
    image: "https://i.ebayimg.com/thumbs/images/g/8UcAAOSwUxhe7BNY/s-l140.jpg",
    rating: "Not Available",
  },
  {
    title: "Digital Piano Keyboard 61 Key - Portable...",
    price: "$58.87",
    website: "ebay",
    link: "https://www.ebay.com/itm/Digital-Piano-Keyboard-61-Key-Portable-Electronic-Instrument-Stand-Mic-/313267275725",
    image: "https://i.ebayimg.com/thumbs/images/g/oLsAAOSwik1fj~qL/s-l140.jpg",
    rating: "Not Available",
  },
  {
    title: "Great Value Tomato Sauce, 8 oz Can",
    price: "$0.48",
    website: "walmart",
    link: "https://www.walmart.com/ip/Great-Value-Tomato-Sauce-8-oz-Can/10415487?athbdg=L1600",
    image: "https://i5.walmartimages.com/asr/e4ffb252-99f3-453d-9764-65a1a1cc1e50.16f5c2dd0954b853f81ed1e987960f1c.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff",
    rating: "4.3"
  }
];

export default function Home() {
  const classes = useStyles();
  const { cartState, removeFromCart } = useCart();

  // Commenting out the handleRefresh function
  /*
  const handleRefresh = () => {
    alert("Latest prices updated");
  };
  */

  const handleRemove = (item) => {
    removeFromCart(item);
  };

  return (
    <Grid container>
      {/* <AddToWishlist /> */}
      {cartState.items.length > 0 && (
        <div className={classes.tableContainer}>
          <h2> My Wishlist </h2>
          <table className={classes.table}>
            <thead>
              <tr>
                {Object.keys(cartState.items[0]).map((key) => key !== 'timestamp' && (
                  <th key={key} className={classes.th}>{key === 'link' ? 'Get Link' : key}</th>
                ))}
                <th className={classes.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartState.items.map((item, index) => (
                <tr key={index}>
                  {Object.entries(item).map(([key, value]) => (
                    key !== 'timestamp' && (
                      <td key={key} className={classes.td}>
                        {key === 'link' ? (
                          <a href={value} target="_blank" rel="noopener noreferrer" className={classes.link}>
                            Get Link
                          </a>
                        ) : key === 'image' ? (
                          <img src={value} alt={item.title} className={classes.image} />
                        ) : (
                          value
                        )}
                      </td>
                    )
                  ))}
                  <td className={classes.td}>
                    {/* Commenting out the Refresh button
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={handleRefresh}
                      className={classes.refreshButton}
                    >
                      Refresh
                    </Button>
                    */}
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={() => handleRemove(item)}
                      className={classes.removeButton}
                    >
                      Remove
                    </Button>
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
