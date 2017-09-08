import { connect } from 'react-redux';
import { login, logout } from '../../actions/session_actions';
import HomeBar from './home_bar';

const mapStateToProps = ({ currentUser }) => ({ currentUser });

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  demoLogin: () => dispatch(login({username: 'Guest', password: 'password'})),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeBar);