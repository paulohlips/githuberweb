import React, { Component } from "react";
import PropTypes from "prop-types";
import api from "../../services/api";

import { Link } from "react-router-dom";
import Container from "../../Components/Container";
import { Loading, Owner, IssueList } from "./styles";

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string
      })
    }).isRequired
  };

  state = {
    repository: {},
    issues: [],
    loading: true
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`),
      {
        params: "open",
        per_page: 5
      }
    ]);

    this.setState({
      repository: repository.data,
      loading: false,
      issues: issues.data
    });
  }

  render() {
    const { repository, issues, loading } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }
    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.avatar_url} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} />
              <div>
                <strong>
                  <a href={issue.user.avatar_url}>{issues.title}</a>
                  {issues.labels.map(label => {
                    <span key={String(label.id)}>{label.name}</span>;
                  })}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
      </Container>
    );
  }
}
