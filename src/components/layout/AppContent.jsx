import { Layout, Typography } from 'antd';
import { useContext } from 'react';
import CryptoContext from '../../context/crypto-context';
import PortfolioChart from './PortfolioChart';
import AssetsTable from './AssetsTable';

const contentStyle = {
	textAlign: 'center',
	minHeight: 'calc(100vh - 60px)',
	lineHeight: '120px',
	color: '#fff',
	backgroundColor: '#001529',
	padding: '1rem',
};

export default function AppCotent() {
	const { assets, crypto } = useContext(CryptoContext)

	const cryptoPriceMap = crypto.reduce((map, coin) => {
		map[coin.id] = coin.price
		return map
	}, {})

	return <Layout.Content style={contentStyle}>
		<Typography.Title style={{ textAlign: 'left', color: '#fff' }} level={3}>
			Deposit: {assets.map(asset => asset.amount * cryptoPriceMap[asset.id])
			.reduce((a, b) => a + b, 0).toFixed(2)}$
		</Typography.Title>
		<PortfolioChart />
		<AssetsTable />
	</Layout.Content>
}