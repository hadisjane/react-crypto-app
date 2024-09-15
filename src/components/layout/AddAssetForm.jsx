import { useContext, useState, useRef } from "react"
import CryptoContext from "../../context/crypto-context"
import { Select, Space, Divider, Form, InputNumber, Button, DatePicker, Result } from "antd"
import CoinInfo from "./ConiInfo"

export default function AddAssetForm({ onClose }) {
	const { crypto, addAsset } = useContext(CryptoContext)
	const [coin, setCoin] = useState(null)
	const [form] = Form.useForm();
	const [submitted, setSubmitted] = useState(false)
	const assetRef = useRef()

	if (submitted) {
		return (
			<Result
				status="success"
				title="New Asset Added"
				subTitle={`Added ${assetRef.current.amount} ${coin.symbol} to your account by ${assetRef.current.price.toFixed(2)}$.`}
				extra={[
					<Button type="primary" key="console" onClick={onClose}>
						Close
					</Button>,
				]}
			/>
		)
	}

	const ValidateMessages = {
		required: '${label} is required!',
		types: {
			number: '${label} is not a valid number!',
		},
		number: {
			range: '${label} must be between ${min} and ${max}',
		},
	};

	if (!coin) {
		return (
			<Select
				style={{
					width: '100%',
				}}
				onSelect={(v) => setCoin(crypto.find((c) => c.id === v))}
				placeholder='Select coin'
				options={crypto.map(coin => ({
					label: coin.name,
					value: coin.id,
					icon: coin.icon,
				}))}
				optionRender={(option) => (
					<Space>
						<img style={{ width: 20, height: 20 }} src={option.data.icon} alt={option.data.label} /> {option.data.label}
					</Space>
				)}
			/>
		)
	}

	function onFinish(values) {
		const newAsset = {
			id: coin.id,
			amount: values.amount,
			price: values.price,
			date: values.date?.$d ?? new Date(),
		}
		setSubmitted(true)
		assetRef.current = newAsset
		addAsset(newAsset)
	}

	function handleAmountChange(value) {
		const price = form.getFieldValue('price')
		form.setFieldsValue({
			total: +(price * value).toFixed(2),
		})
	}

	function handlePriceChange(value) {
		const amount = form.getFieldValue('amount')
		form.setFieldsValue({
			total: +(amount * value).toFixed(2),
		})
	}

	return <Form
		form={form}
		name="basic"
		labelCol={{
			span: 4,
		}}
		wrapperCol={{
			span: 10,
		}}
		style={{
			maxWidth: 600,
		}}
		initialValues={{
			price: +coin.price.toFixed(2),
		}}
		onFinish={onFinish}
		validateMessages={ValidateMessages}
	>
		<CoinInfo coin={coin} />
		<Divider />

		<Form.Item
			label="Amount"
			name="amount"
			rules={[
				{
					required: true,
					type: 'number',
					min: 0,
				},
			]}
		>
			<InputNumber
				placeholder="Enter coin amount"
				onChange={handleAmountChange}
				style={{ width: '100%' }} />
		</Form.Item>

		<Form.Item label="Price" name="price">
			<InputNumber onChange={handlePriceChange} style={{ width: '100%' }} />
		</Form.Item>

		<Form.Item label="Date & Time" name="date">
			<DatePicker showTime style={{ width: '100%' }} />
		</Form.Item>

		<Form.Item label="Total" name="total">
			<InputNumber disabled style={{ width: '100%' }} />
		</Form.Item>

		<Form.Item>
			<Button type="primary" htmlType="submit">
				Add Asset
			</Button>
		</Form.Item>

	</Form>

}