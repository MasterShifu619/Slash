import React from 'react';
import { Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';

const ComparisonModal = ({ open, onClose, items }) => {
  // Check if items array is empty or undefined
  if (!items || items.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Product Comparison</DialogTitle>
        <DialogContent>
          <p>No items selected for comparison.</p>
          <Button onClick={onClose} color="primary" style={{ marginTop: '20px' }}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  // Get all unique features from all items
  const allFeatures = Array.from(new Set(items.flatMap(item => Object.keys(item))));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Product Comparison</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Feature</TableCell>
              {items.map((item, index) => (
                <TableCell key={index}>{item.title || `Item ${index + 1}`}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allFeatures.map((feature) => (
              <TableRow key={feature}>
                <TableCell>{feature}</TableCell>
                {items.map((item, index) => (
                  <TableCell key={index}>{item[feature] || 'N/A'}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={onClose} color="primary" style={{ marginTop: '20px' }}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ComparisonModal;