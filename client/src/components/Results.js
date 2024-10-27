import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Table from "@mui/material/Table";
import TablePagination from "@mui/material/TablePagination";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { visuallyHidden } from "@mui/utils";
import { useLocation } from "react-router-dom";
import { useCart } from './Cart';
import { CartProvider } from './Cart';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';


const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    marginBottom: 20,
  },
  pos: {
    marginBottom: 12,
  },
  cardMedia: {
    objectFit: 'contain', // Prevent images from zooming in
    maxHeight: 140,
  },
  currencySelector: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    '& label': {
      marginRight: theme.spacing(1),
    },
    '& select': {
      padding: theme.spacing(1),
      fontSize: '1rem',
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.primary.main}`,
    },
  },

  addToCartButton: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
  inputField: {
    '& input[type="number"]': {
      padding: theme.spacing(1),
      fontSize: '1rem',
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.primary.main}`,
      '&::-webkit-inner-spin-button': {
        opacity: 1,
      },
    },
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    padding: theme.spacing(2),
  },
  
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  
  label: {
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  
  input: {
    '& .MuiInputBase-input': {
      padding: '6px 8px',
      height: '20px',
    },
    '& .MuiOutlinedInput-root': {
      height: '32px',
      width: '80px',
      '& fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      }
    },
    '& .MuiSelect-select': {
      padding: '6px 8px',
      height: '20px',
    },
  },

  currencySelect: {
    height: '32px',
    width: '100px', // Increased width to show full currency code
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    '& .MuiSelect-select': {
      padding: '6px 8px',
      height: '20px',
      minWidth: 'auto', // Prevent text truncation
      whiteSpace: 'nowrap', // Prevent text wrapping
    }
  }
}));


/**
 * Function to compare two operators a and b
 * @param {*} a dict of items
 * @param {*} b dict of items
 * @param {*} orderBy key to order by
 * @returns
 */
function descendingComparator(a, b, orderBy) {
  // Helper function to extract numeric value from price string
  const extractPrice = (priceString) => {
    if (!priceString) return 0;
    const match = priceString.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const aPrice = extractPrice(a[orderBy]);
  const bPrice = extractPrice(b[orderBy]);

  if (bPrice < aPrice) {
    return -1;
  }
  if (bPrice > aPrice) {
    return 1;
  }
  return 0;
}

/**
 * Function to determine ascending or descending order
 * @param {*} order ascending / descending
 * @param {*} orderBy key to order by
 * @returns
 */
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "image",
    numeric: false,
    disablePadding: false,
    label: "Image"
  },
  {
    id: "timestamp",
    numeric: false,
    disablePadding: false,
    label: "Timestamp"
  },
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Title"
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Price"
  },
  {
    id: "website",
    numeric: false,
    disablePadding: false,
    label: "Website"
  },
  {
    id: "link",
    numeric: false,
    disablePadding: false,
    label: "Link"
  },
  {
    rating: "rating",
    numeric: false,
    disablePadding: false,
    label: "Rating"
  }
];

/**
 * Builds the table header
 * @param {*} props props passed from the parent component
 * @returns
 */
function EnhancedTableHead(props) {
  const { order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <div>
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    </div>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const EnhancedTableToolbar = () => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...{
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        }
      }}
    >
      <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
        Results
      </Typography>
    </Toolbar>
  );
};
const CurrencySelector = ({ selectedCurrency, handleCurrencyChange }) => {
  const classes = useStyles();
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          'https://open.er-api.com/v6/latest'
        );
        setExchangeRates(response.data.rates);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  const currencies = Object.keys(exchangeRates);

  if (loading) {
    return <div>Loading exchange rates...</div>;
  }

  return (
    <div className={`${classes.currencySelector} ${classes.inputField}`}>
      <label htmlFor="currency" className={classes.pos}>Select Currency: </label>
      <select
        id="currency"
        value={selectedCurrency}
        onChange={(e) => handleCurrencyChange(e.target.value)}
        className={classes.pos}
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
};
// Add before the EnhancedTableToolbar component (around line 394)
const PriceRangeFilter = ({ minPrice, maxPrice, handleMinPriceChange, handleMaxPriceChange }) => {
  const classes = useStyles();
  
  return (
    <div className={`${classes.currencySelector} ${classes.inputField}`}>
      <label htmlFor="priceRange" className={classes.pos}>Price Range: </label>
      <input
        type="number"
        id="minPrice"
        value={minPrice}
        onChange={(e) => handleMinPriceChange(e.target.value)}
        placeholder="Min Price"
        min="0"
        className={classes.pos}
        style={{ marginRight: '10px', width: '100px' }}
      />
      <input
        type="number"
        id="maxPrice"
        value={maxPrice === Number.MAX_SAFE_INTEGER ? '' : maxPrice}
        onChange={(e) => handleMaxPriceChange(e.target.value)}
        placeholder="Max Price"
        min="0"
        className={classes.pos}
        style={{ width: '100px' }}
      />
    </div>
  );
};
/**
 * Genrates the results table
 * @returns
 */
export default function Results() {
  const { addToCart } = useCart();
  const location = useLocation();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("price");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [cart, setCart] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  let rows = null;
  const [minRating, setMinRating] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Number.MAX_SAFE_INTEGER);
  const [selected, setSelected] = useState([]);

  const handleMinRatingChange = (event) => {
    const newMinRating = parseInt(event.target.value, 10);
    setMinRating(newMinRating);
  };

  const classes = useStyles();
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          'https://open.er-api.com/v6/latest'
        );
        setExchangeRates(response.data.rates);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    fetchExchangeRates();
  }, []);

  const convertPriceToSelectedCurrency = (originalPrice, targetCurrency) => {
    try {
      if (!exchangeRates || !exchangeRates[targetCurrency]) {
        throw new Error('Invalid exchange rate for the selected currency');
      }

      const conversionRate = exchangeRates[targetCurrency];

      // Use the exchange rate to perform the currency conversion
      const convertedAmount = (parseFloat(originalPrice.replace('$', '')) * conversionRate).toFixed(2);
      return `${convertedAmount}`;
    } catch (error) {
      console.error('Error converting currency:', error);
      return 'N/A';
    }
  };

  const getPriceInSelectedCurrency = (originalPrice) => {
    return `${selectedCurrency} ${convertPriceToSelectedCurrency(originalPrice, selectedCurrency)}`;
  };

  const handleMinPriceChange = (value) => {
    setMinPrice(value === '' ? 0 : Number(value));
  };

  const handleMaxPriceChange = (value) => {
    setMaxPrice(value === '' ? Number.MAX_SAFE_INTEGER : Number(value));
  };

  const extractPrice = (priceString) => {
    if (!priceString) return 0;
    const match = priceString.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  if (location.state == null) {
    return (
      <div>
        <h2>{"Search for what you want in the menu page so I can find related information for you!"}</h2>
      </div>
    );
  } else {
    rows = JSON.parse(location.state.response);
    console.log(rows);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    alert(`Item "${item.title}" added to the wishlist!`);
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
  };

  
  const getClickableLink = (link) => {
    if (link == null) {
      return "";
    } else {
      return link.startsWith("http://") || link.startsWith("https://") ? link : `//${link}`;
    }
  };

  const sortedRows = stableSort(rows, getComparator(order, orderBy));

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  // const classes = useStyles();

  console.log(rows);
  if (rows == null) {
    return (
      <div>
        <h2>{"Oops I couldn't find what you are looking for! :/"}</h2>
      </div>
    );
  } else {
    return (
      <Box sx={{ width: "100%", padding: 2 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <div className={classes.inputContainer}>
          <div className={classes.inputGroup}>
            <Typography className={classes.label}>Select Currency:</Typography>
            <Select
              value={selectedCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              size="small"
              className={classes.currencySelect}
            >
              {Object.keys(exchangeRates).map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className={classes.inputGroup}>
            <Typography className={classes.label}>Price Range:</Typography>
            <TextField
              type="number"
              value={minPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              placeholder="Min Price"
              InputProps={{ inputProps: { min: 0 } }}
              className={classes.input}
            />
            <span>-</span>
            <TextField
              type="number"
              value={maxPrice === Number.MAX_SAFE_INTEGER ? '' : maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              placeholder="Max Price"
              InputProps={{ inputProps: { min: 0 } }}
              className={classes.input}
            />
          </div>

          <div className={classes.inputGroup}>
            <Typography className={classes.label}>Min Rating:</Typography>
            <TextField
              type="number"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              InputProps={{ 
                inputProps: { 
                  min: 0,
                  max: 5,
                  step: 0.1
                } 
              }}
              className={classes.input}
            />
          </div>
        </div>
        <EnhancedTableToolbar />
          <Grid container spacing={2}>
            {rows
            // .filter((row) => row.rating >= minRating)
            .filter((row) => {
              const price = extractPrice(row.price);
              return price >= minPrice && price <= maxPrice;
            })
            .map((row, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card className={classes.root}>
                  <CardMedia
                    component="img"
                    alt={row.title}
                    height="140"
                    image={row.image}
                    className={classes.cardMedia}
                  />
                  <CardContent>
                    <Typography variant="h6">{row.title}</Typography>
                    <Typography variant="subtitle1">
                      Price: {getPriceInSelectedCurrency(row.price)}
                    </Typography>
                    <Typography variant="subtitle1">Website: {row.website}</Typography>
                    <Typography variant="subtitle1">
                      Link:{' '}
                      {row.link == null ? (
                        'No link'
                      ) : (
                        <Link href={row.link} target="_blank" rel="noopener">
                          Visit
                        </Link>
                      )}
                    </Typography>
                    <Button
                onClick={() => handleAddToCart(row)}
                className={classes.addToCartButton}
              >
                Add to Wishlist
              </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Paper>
      </Box>
    );
  }
 
}

