import React from 'react'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import web3 from './../ethereum/web3'
import compaign from './../ethereum/compaign'

export default class extends React.Component {
  state = {
    value: '1000',
    error: '',
    processing: false,
    success: ''
  }

  async onSubmit (e, value) {
    e.preventDefault()
    const { updateCompaignData, compaignAddress } = this.props

    const accounts = await web3.eth.getAccounts()
    const compaignInstance = compaign(compaignAddress)
    if (!accounts || !compaignInstance || !accounts.length) {
      this.setState({ error: 'No Account Found, try refreshing the page.' })
    }

    this.setState({ processing: true, error: '', success: '' })
    try {
      await compaignInstance.methods.contribute().send({
        from: accounts[0],
        value: value
      })
      this.setState({
        success: 'Contribution added successfully :)',
        error: ''
      })
      await updateCompaignData()
    } catch (error) {
      this.setState({ error: error.message, success: '' })
    }
    this.setState({ processing: false })
  }

  render () {
    const { value, error, processing, success } = this.state
    const { minimumContribution } = this.props

    return (
      <>
        {!!success && <Message success header='Great!' content={success} />}
        <h3>Contribute to Compaign</h3>
        <Form
          error={!!error}
          loading={processing}
          onSubmit={e => this.onSubmit(e, value)}
        >
          <Form.Field>
            <label>Amount to Contribute (Wei)</label>
            <Input
              label='Wei'
              labelPosition='right'
              value={value}
              onChange={e => this.setState({ value: e.target.value })}
              placeholder={`Enter value of 'Wei' you want to contribute. (Min ${minimumContribution} Wei)`}
              min={minimumContribution}
            />
          </Form.Field>
          <Message error header='Oops!' content={error} />
          <Button
            primary
            disabled={
              processing ||
              !value ||
              isNaN(value) ||
              parseInt(value) < minimumContribution
            }
          >
            Contribute
          </Button>
        </Form>
      </>
    )
  }
}
