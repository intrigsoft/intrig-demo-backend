#!/bin/bash

echo "========================================="
echo "Testing Product Search API Features"
echo "========================================="
echo ""

echo "1. Basic Pagination (default: page=1, limit=10)"
echo "-------------------------------------------------"
curl -s "http://localhost:5001/products" | jq '.meta'
echo ""

echo "2. Custom Pagination (page=1, limit=2)"
echo "-------------------------------------------------"
curl -s "http://localhost:5001/products?page=1&limit=2" | jq '.meta'
echo ""

echo "3. Sorting by Price (ascending)"
echo "-------------------------------------------------"
curl -s "http://localhost:5001/products?sortBy=price&sortOrder=asc" | jq '.data[] | {name, price}'
echo ""

echo "4. Sorting by Price (descending)"
echo "-------------------------------------------------"
curl -s "http://localhost:5001/products?sortBy=price&sortOrder=desc" | jq '.data[] | {name, price}'
echo ""

echo "5. Full-text Search (search='bluetooth')"
echo "-------------------------------------------------"
curl -s "http://localhost:5001/products?search=bluetooth" | jq '.data[] | {name, description}'
echo ""

echo "6. Full-text Search (search='sports')"
echo "-------------------------------------------------"
curl -s "http://localhost:5001/products?search=sports" | jq '.data[] | {name, category}'
echo ""

echo "7. Advanced Search - Filter by Category"
echo "-------------------------------------------------"
curl -s "http://localhost:5001/products?category=Electronics" | jq '.data[] | {name, category}'
echo ""

echo "8. Advanced Search - Filter by Stock Availability"
echo "-------------------------------------------------"
curl -s "http://localhost:5001/products?inStock=true" | jq '.data[] | {name, inStock}'
echo ""

echo "9. Advanced Search - Price Range (min=20, max=100)"
echo "-------------------------------------------------"
curl -s "http://localhost:5001/products?minPrice=20&maxPrice=100" | jq '.data[] | {name, price}'
echo ""

echo "10. Combined Search - Category + Sorting + Pagination"
echo "-------------------------------------------------"
curl -s "http://localhost:5001/products?category=Electronics&sortBy=price&sortOrder=desc&page=1&limit=3" | jq '{meta, products: .data[] | {name, price, category}}'
echo ""

echo "11. Full-text Search + Price Range + Sorting"
echo "-------------------------------------------------"
curl -s "http://localhost:5001/products?search=bluetooth&minPrice=20&sortBy=price&sortOrder=asc" | jq '{meta, products: .data[] | {name, price}}'
echo ""

echo "========================================="
echo "All tests completed!"
echo "========================================="
