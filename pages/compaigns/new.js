import React from 'react'
import { Form, Button, Input, Message } from 'semantic-ui-react'
import Layout from './../../components/Layout'
import web3 from './../../ethereum/web3'
import factory from './../../ethereum/factory'
import { Router } from './../../routes'

export default class extends React.Component {
  state = {
    minContribution: '100',
    processing: false,
    error: ''
  }

  async componentDidMount () {
    const accounts = await web3.eth.getAccounts()
    console.log({ accounts })
  }

  async onSubmit (minContribution) {
    this.setState({ processing: true, error: '' })
    try {
      const accounts = await web3.eth.getAccounts()
      console.log({ accounts })
      await factory.methods.createCompaign(minContribution).send({
        from: accounts[0]
      })
      Router.push('/')
    } catch (error) {
      this.setState({ processing: false, error: error.message })
    }
    this.setState({ processing: false })
  }

  render () {
    const { minContribution, processing, error } = this.state
    return (
      <Layout>
        <h3>Create New Compaign</h3>
        <Form
          onSubmit={() => this.onSubmit(minContribution)}
          error={!!error}
          loading={processing}
        >
          <Form.Field>
            <label>Minimum Contribution for Compaign</label>
            <Input
              label='Wei'
              labelPosition='right'
              value={minContribution}
              onChange={e => this.setState({ minContribution: e.target.value })}
              required
              min='100'
              placeholder='Enter Min Contribution (min 10wei)'
            />
          </Form.Field>
          <Message error header='Oops!' content={error} />
          <Button
            primary
            icon='check'
            content='Submit'
            type='submit'
            disabled={
              isNaN(minContribution) || minContribution < 10 || processing
            }
          />
        </Form>
      </Layout>
    )
  }
}
