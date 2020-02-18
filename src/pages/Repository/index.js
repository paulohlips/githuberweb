import React, { Component } from "react";
import PropTypes from "prop-types";
import api from "../../services/api";

import { Link } from "react-router-dom";
import Container from "../../Components/Container";
import { Loading, Owner } from "./styles";

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

    this.setState({ repository, loading: false });

    console.log(this.state.repository);

    //console.log(issues);
  }

  render() {
    const { repository, issues, loading } = this.state;
    console.log("REPO", repository);
    if (loading) {
      return <Loading>Carregando</Loading>;
    }
    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img
            src={repository.data.owner.avatar_url}
            alt={repository.data.avatar_url}
          />
          <h1>{repository.data.name}</h1>

          <p>{repository.data.description}</p>
        </Owner>
      </Container>
    );
  }
}
