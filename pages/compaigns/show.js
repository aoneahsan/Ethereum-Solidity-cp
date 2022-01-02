import React from 'react'
import { Card, Grid, Button } from 'semantic-ui-react'
import CompaignForm from '../../components/CompaignForm'
import Layout from './../../components/Layout'
import compaign from './../../ethereum/compaign'
import { Link, Router } from './../../routes'

export default class extends React.Component {
  state = {
    minimumContribution: null,
    balance: null,
    requestsCount: null,
    compaignApproversCount: null,
    manager: null,
    finalizedRequestsCount: null,
    requestsWaitingApprovals: null,
    compaignAddress: ''
  }

  static async getInitialProps (props) {
    const { address } = props.query
    const compaignInstance = compaign(address)
    const summary = await compaignInstance.methods.getSummary().call()

    return {
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      compaignApproversCount: summary[3],
      manager: summary[4],
      finalizedRequestsCount: summary[5],
      requestsWaitingApprovals: summary[6],
      compaignAddress: address
    }
  }

  componentDidMount () {
    const {
      minimumContribution,
      balance,
      requestsCount,
      compaignApproversCount,
      manager,
      finalizedRequestsCount,
      requestsWaitingApprovals,
      compaignAddress
    } = this.props

    this.setState({
      minimumContribution,
      balance,
      requestsCount,
      compaignApproversCount,
      manager,
      finalizedRequestsCount,
      requestsWaitingApprovals,
      compaignAddress
    })
  }

  getCompaignDetails () {
    const {
      minimumContribution,
      balance,
      requestsCount,
      compaignApproversCount,
      manager,
      finalizedRequestsCount,
      requestsWaitingApprovals
    } = this.state
    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description:
          'The manager created this compaign and can create requests to withdraw money.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (Wei)',
        description:
          'You must contribute at least this much "wei" to become a approver.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: requestsCount,
        meta: 'Number of Requests (pending + approved requests)',
        description:
          'A request tries to withdraw money from compaign. Requests must be approved by approvers.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: requestsWaitingApprovals,
        meta: 'Number of Requests Waiting Approval',
        description:
          'Requests waiting approval from approvers. become a approver to add your vote.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: finalizedRequestsCount,
        meta: 'Number of Approved/Finalized Requests',
        description:
          'Requests which got completed after getting more than 50% approves from approvers.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: compaignApproversCount,
        meta: 'No. of Approvers',
        description:
          'Number of people who have already donated to this compaign.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: balance,
        meta: 'Compaign Balance (Wei)',
        description:
          'The balance is how much money this compaign has left to spend.',
        style: { overflowWrap: 'break-word' }
      }
    ]

    return <Card.Group items={items} />
  }

  updateCompaignData (compaignAddress) {
    Router.replaceRoute(`/compaigns/${compaignAddress}`)
  }

  render () {
    const { compaignAddress, minimumContribution } = this.state
    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <h3>Compaign Requests</h3>
              <Link route={`/compaigns/${compaignAddress}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={10}>
              <h3>Compaign Details</h3>
              {this.getCompaignDetails()}
            </Grid.Column>
            <Grid.Column width={6}>
              <CompaignForm
                compaignAddress={compaignAddress}
                minimumContribution={minimumContribution}
                updateCompaignData={() =>
                  this.updateCompaignData(compaignAddress)
                }
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    )
  }
}
