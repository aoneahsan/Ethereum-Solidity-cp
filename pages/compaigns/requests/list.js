import React from 'react'
import { Button, Grid, Tab, Table } from 'semantic-ui-react'
import Layout from './../../../components/Layout'
import { Link, Router } from './../../../routes'
import compaign from './../../../ethereum/compaign'
import RequestRow from './../../../components/RequestRow'

const { Header, Body, Row, HeaderCell } = Table

export default class extends React.Component {
  state = {}

  static async getInitialProps (props) {
    const { address } = props.query
    const compaignInstance = compaign(address)
    const requestsCount = await compaignInstance.methods.requestsCount().call()
    const compaignApproversCount = await compaignInstance.methods
      .compaignApproversCount()
      .call()

    const requests =
      requestsCount > 0
        ? await Promise.all(
            Array(requestsCount)
              .fill()
              .map((e, i) => {
                return compaignInstance.methods.requests(i).call()
              })
          )
        : []
    const reqs = requests.map(e => {
      return {
        description: e.description,
        value: e.value,
        recipient: e.recipient,
        complete: e.complete,
        approvalCount: e.approvalCount
      }
    })

    return { address, requests: reqs, requestsCount, compaignApproversCount }
  }

  componentDidMount () {}

  renderRows (address) {
    return this.props.requests.map((e, i) => {
      return (
        <RequestRow
          key={i}
          id={i}
          request={e}
          address={this.props.address}
          compaignApproversCount={this.props.compaignApproversCount}
          refreshPage={() => this.refreshPage(address)}
        />
      )
    })
  }

  refreshPage (address) {
    Router.replaceRoute(`/compaigns/${address}/requests`)
  }

  render () {
    const { address, requestsCount } = this.props
    return (
      <Layout>
        <h3>Requests List - {requestsCount} Request Found </h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={12} />
            <Grid.Column width={4}>
              <Link route={`/compaigns/${address}/requests/new`}>
                <a>
                  <Button primary>Create Request</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Table>
              <Header>
                <Row>
                  <HeaderCell>ID</HeaderCell>
                  <HeaderCell>Description</HeaderCell>
                  <HeaderCell>Amount</HeaderCell>
                  <HeaderCell>Recipient</HeaderCell>
                  <HeaderCell>Approval Count</HeaderCell>
                  <HeaderCell>Approve</HeaderCell>
                  <HeaderCell>Finalize</HeaderCell>
                </Row>
              </Header>
              <Body>{this.renderRows(address)}</Body>
            </Table>
          </Grid.Row>
        </Grid>
      </Layout>
    )
  }
}
