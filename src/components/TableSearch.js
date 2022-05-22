import React, { useState } from 'react';
import { filter } from 'lodash';
import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePaginationUnstyled, {
	tablePaginationUnstyledClasses as classes,
} from '@mui/base/TablePaginationUnstyled';
import { visuallyHidden } from '@mui/utils';
import '../custom/components/tableSearch.scss';
import  PropTypes from 'prop-types';


// ------------------------------------- Style -----------------------------------------------------

const Root = styled('div')(
	() => `
	table {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    	'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    	sans-serif;
		border-collapse: collapse;
		width: 100%;
	}

	td,
	th {
		text-align: center;
		padding: 6px;
		font-size: 11px;
	}

	th {
		background-color: #F0F0F2;
		color: black;
		font-size: 12px;
	}
	`,
);

const CustomTablePagination = styled(TablePaginationUnstyled)(
	() => `
	& .${classes.spacer} {
		display: none;
	}

	& .${classes.toolbar}  {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;

		@media (min-width: 768px) {
			flex-direction: row;
			align-items: center;
		}
	}

	& .${classes.selectLabel} {
		margin: 0;
	}

	& .${classes.select}{
		padding: 2px;
		border: 1px solid '#E0E3E7';
		border-radius: 50px;
		background-color: transparent;

		&:hover {
			background-color: '#F3F6F9';
		}

		&:focus {
			outline: 1px solid '#A5D8FF';
		}
	}

	& .${classes.displayedRows} {
		margin: 0;

		@media (min-width: 768px) {
			margin-left: auto;
		}
	}

	& .${classes.actions} {
		padding: 2px;
		border: 1px solid '#E0E3E7';
		border-radius: 50px;
		text-align: center;
	}

	& .${classes.actions} > button {
		margin: 0 8px;
		border: transparent;
		border-radius: 2px;
		background-color: transparent;

		&:hover {
			background-color: '#F3F6F9';
		}

		&:focus {
			outline: 1px solid '#A5D8FF';
		}
	}
	`,
);

// function to create tableBody 

	Row.propTypes = {
		tableHead: PropTypes.array,
		data: PropTypes.object
	}


	function Row({ tableHead, data}) {
		return (
			<tr>
				{tableHead.map((col, index) => (
					<td align='center' key={index}>
						{data.label[col.id]}
					</td>
				))}
			</tr>
		);
	}


// -----------------------------------------------------

TableSearch.propTypes = {
	tableHead: PropTypes.array,
	tableBody: PropTypes.array,
	defaultSort: PropTypes.exact({
		orderBy: PropTypes.string,
		order: PropTypes.string
	})
};

TableSearch.defaultProps = {
	tableHead: [],
	tableBody: [],
	defaultSort: { order: 'asc', orderBy: null}
}

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
	  return -1;
	}
	if (b[orderBy] > a[orderBy]) {
	  return 1;
	}
	return 0;
}
  
function getComparator(order, orderBy) {
	return order === 'desc'
	  ? (a, b) => descendingComparator(a, b, orderBy)
	  : (a, b) => -descendingComparator(a, b, orderBy);
}
  

function stableSort(array, comparator, query) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
	  	}
	  	return a[1] - b[1];
	});
	if(query) {
		return filter(array, (element) =>
			Object.values(element).some((value) =>
				typeof value === 'number'
					? value.toString().indexOf(query) !== -1
					: value !== null &&
					  value !== undefined &&
					  value.toLowerCase().indexOf((query).toLowerCase()) !== -1
			)
		);
	}
	return stabilizedThis.map((el) => el[0]);
}

export default function TableSearch({ tableHead, tableBody, defaultSort }) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [searched, setSearched] = useState('');
	const [order, setOrder] = useState(defaultSort.order);
	const [orderBy, setOrderBy] = useState(defaultSort.orderBy);


	const filteredBody = stableSort(
		tableBody,
		getComparator(order, orderBy),
		searched
	)

	// functions to agination
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableBody.length) : 0;

	const handleChangePage = (e, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};
  
	function EnhancedTableHead( props ) {
		const { order, orderBy, onRequestSort } =
		  props;
		const createSortHandler = (property) => (event) => {
		  onRequestSort(event, property);
		};

		return (
			<thead>
				<tr>
					{tableHead.map((headCell) => (
						<th
							key={headCell.id}
							align='center'
							padding={headCell.disablePadding ? 'none' : 'normal'}
							direction={orderBy === headCell.id ? order : 'asc'}
						>
							<TableSortLabel
								active={orderBy === headCell.id}
								direction={orderBy === headCell.id ? order : 'asc'}
								onClick={createSortHandler(headCell.id)}
							>
								{headCell.label}
								{orderBy === headCell.id ? (
									<Box component="span" sx={visuallyHidden}>
										{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
									</Box>
								) : null}
							</TableSortLabel>
						</th>
					))}
				</tr>
			</thead>
		)
	}
	
	const handleRequestSort = (e, property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleFilterBySearch = (e) => {
		setSearched(e.target.value)
	}

	return (
		<Paper sx={{ width: '100%', overflowY: 'auto', overflowX: 'auto'}}>
		<Root sx={{ maxWidth: '100%' }}>
			<input
				className='search-table'
				placeholder='Search ...'
				value={searched}
				onChange={handleFilterBySearch}
        	/> 
			<table>
				<EnhancedTableHead
					order={order}
					orderBy={orderBy}
					onRequestSort={handleRequestSort}
					rowCount={tableBody.length}
				/>
				<tbody>
					{filteredBody
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((row, rowId) => (
							<Row
								key={rowId}
								tableHead={tableHead}
								data={row}
							/>
						)
					)}

					{emptyRows > 0 && (
						<tr style={{ height: 34 * emptyRows }}>
							<td colSpan={3} />
						</tr>
					)}
				</tbody>
				<tfoot>
					<tr>
						<CustomTablePagination
							rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
							count={tableBody.length}
							rowsPerPage={rowsPerPage}
							page={page}
							componentsProps={{
								select: {
									'aria-label': 'rows per page',
								},
								actions: {
									showFirstButton: true,
									showLastButton: true,
								},
							}}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</tr>
				</tfoot>
			</table>
		</Root>
		</Paper>
	);
}
