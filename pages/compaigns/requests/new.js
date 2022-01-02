import React from 'react'
import { Button, Form, Grid, Input, Message } from 'semantic-ui-react'
import Layout from './../../../components/Layout'
import { Router, Link } from './../../../routes'
import web3 from './../../../ethereum/web3'
import compaign from './../../../ethereum/compaign'

export default class extends React.Component {
  state = {
    request: {
      description: 'Testing ',
      value: '0.0000001',
      recipient: '0xd251dab2d380f730386c346F08999D863072Dc67'
    },
    error: '',
    success: '',
    process: false
  }

  static async getInitialProps (props) {
    const { address } = props.query
    return { address }
  }

  componentDidMount () {}

  onChangeHandler (field, value) {
    const { request } = this.state
    const requestCopy = { ...request }
    requestCopy[field] = value
    this.setState({ request: requestCopy })
  }

  async onSubmitHandler (e, address, request) {
    e.preventDefault()
    const { description, value, recipient } = request

    this.setState({ processing: true, error: '' })
    try {
      const accounts = await web3.eth.getAccounts()
      const compaignInstance = compaign(address)
      await compaignInstance.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({
          from: accounts[0]
        })
      Router.push(`/compaigns/${address}/requests`)
    } catch (error) {
      this.setState({ processing: false, error: error.message })
    }
    this.setState({ processing: false })
  }

  render () {
    const { address } = this.props
    const { request, processing, error } = this.state
    const { description, value, recipient } = request
    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column width={14}>
              <h3>Create New Request</h3>
            </Grid.Column>
            <Grid.Column width={2} stretched>
              <Link route={`/compaigns/${address}/requests`}>
                <a>Go Back</a>
              </Link>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Form
                onSubmit={e => this.onSubmitHandler(e, address, request)}
                loading={processing}
                error={!!error}
              >
                <Form.Field>
                  <label>Request Description</label>
                  <Input
                    value={description}
                    onChange={e =>
                      this.onChangeHandler('description', e.target.value)
                    }
                    placeholder='Request Description'
                    required
                  />
                </Form.Field>
                <Form.Field>
                  <label>Request Value (ether)</label>
                  <Input
                    value={value}
                    onChange={e =>
                      this.onChangeHandler('value', e.target.value)
                    }
                    placeholder='Request value'
                    required
                  />
                </Form.Field>
                <Form.Field>
                  <label>Request recipient</label>
                  <Input
                    value={recipient}
                    onChange={e =>
                      this.onChangeHandler('recipient', e.target.value)
                    }
                    placeholder='Request recipient'
                    required
                  />
                </Form.Field>
                <Message error header='Oops!' content={error} />
                <Button primary disabled={isNaN(value) || parseInt(value) < 0}>
                  Submit
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    )
  }
}
