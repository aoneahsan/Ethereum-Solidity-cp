import React from 'react'
import { Button, Table } from 'semantic-ui-react'
import web3 from './../ethereum/web3'
import compaign from './../ethereum/compaign'

const { Cell, Row } = Table

export default class extends React.Component {
  state = {
    processing: false
  }

  static async getInitialProps (props) {
    const { address } = props.query
    return { address }
  }

  componentDidMount () {}

  async approveRequest (address, id) {
    try {
      this.setState({
        processing: true
      })
      const accounts = await web3.eth.getAccounts()
      const compaignInstance = compaign(address)
      await compaignInstance.methods.approveRequest(id).send({
        from: accounts[0]
      })
      this.props.refreshPage()
      this.setState({
        processing: false
      })
    } catch (error) {
      alert(error.message)
      this.setState({
        processing: false
      })
    }
  }

  async finalizeRequest (address, id) {
    try {
      this.setState({
        processing: true
      })
      const accounts = await web3.eth.getAccounts()
      const compaignInstance = compaign(address)
      await compaignInstance.methods.finalizeRequest(id).send({
        from: accounts[0]
      })

      this.props.refreshPage()
      this.setState({
        processing: false
      })
    } catch (error) {
      alert(error.message)
      this.setState({
        processing: false
      })
    }
  }

  render () {
    const { processing } = this.state
    const { compaignApproversCount, id, request, address } = this.props
    const { description, value, recipient, complete, approvalCount } = request
    const readyToFinalize = approvalCount > compaignApproversCount / 2
    return (
      <Row positive={!complete && readyToFinalize} disabled={processing}>
        <Cell>{id + 1}</Cell>
        <Cell>{description}</Cell>
        <Cell>{value}</Cell>
        <Cell>{recipient}</Cell>
        <Cell>
          {approvalCount}/{compaignApproversCount}
        </Cell>
        <Cell>
          {!complete && (
            <Button
              color='green'
              onClick={() => this.approveRequest(address, id)}
              disabled={processing}
              loading={processing}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {!complete && (
            <Button
              color='black'
              onClick={() => this.finalizeRequest(address, id)}
              disabled={processing}
              loading={processing}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    )
  }
}
