import { render, RenderResult, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'modules';
import { setUser } from 'modules/user';
import { UserData } from 'types';
import JoinGroup from 'components/group/JoinGroup';

const newUser: UserData = {
  displayName: 'test test',
  email: 'test@test.com',
  photoURL: 'photoURL',
  gender: null,
  age: 25,
  hostileRating: 2,
  levelOfExperience: 3,
  peerRating: 4,
  interests: ['test'],
  groups: [],
};

const renderJoinGroup = (): RenderResult =>
  render(
    <Provider store={store}>
      <JoinGroup open={true} handleClose={() => {}} />
    </Provider>
  );

beforeEach(() => {
  store.dispatch(setUser(newUser));
});

describe('<JoinGroup />', () => {
  test('when the session of user expired in the middle of process, display circularProgress', () => {
    renderJoinGroup();
    store.dispatch(setUser(null));
    let groupLoading = screen.getByTestId('circular-progress-joinGroup');
    expect(groupLoading).toBeInTheDocument();
  });

  test('When user open Join a Group from, display Interest selection', () => {
    renderJoinGroup();
    let groupInterest = screen.getByTestId('joinGroup-interest');
    expect(groupInterest).toBeInTheDocument();
  });

  test('When user does not have gender, display gender selection with disabled', () => {
    renderJoinGroup();
    const female = screen.getByLabelText('Female');
    expect(female).toHaveAttribute('disabled');
    const male = screen.getByLabelText('Male');
    expect(male).toHaveAttribute('disabled');
    const other = screen.getByLabelText('Other');
    expect(other).toHaveAttribute('disabled');
    const both = screen.getByLabelText('Both');
    expect(both).not.toHaveAttribute('disabled');
  });

  test('When user is male, only male and both gender selection is enabled', () => {
    let maleUser = Object.assign({}, newUser);
    maleUser.gender = 'male';
    store.dispatch(setUser(maleUser));
    renderJoinGroup();
    const female = screen.getByLabelText('Female');
    expect(female).toHaveAttribute('disabled');
    const male = screen.getByLabelText('Male');
    expect(male).not.toHaveAttribute('disabled');
    const other = screen.getByLabelText('Other');
    expect(other).toHaveAttribute('disabled');
    const both = screen.getByLabelText('Both');
    expect(both).not.toHaveAttribute('disabled');
  });

  test('When user have age, display age slider from 0 to 120', () => {
    renderJoinGroup();
    const ageRange = screen.getAllByText(`Age: Between 0 and 120`)[0];
    expect(ageRange).toBeInTheDocument();
  });

  test('When user have peer rating, display peer rating slider from 0 to 10', () => {
    renderJoinGroup();
    const peerRatingRange = screen.getAllByText(
      `Peer Rating: Between 0 and 10`
    )[0];
    expect(peerRatingRange).toBeInTheDocument();
  });

  test('When user have Hostile rating, display Hostile Rating slider from 0 to 10', () => {
    renderJoinGroup();
    const hostileRatingRange = screen.getAllByText(
      `Hostile Rating: Between 0 and 10`
    )[0];
    expect(hostileRatingRange).toBeInTheDocument();
  });

  test('When user have Level of Experience, display Level of Experience slider from 0 to 10', () => {
    renderJoinGroup();
    const experienceRange = screen.getAllByText(
      `Level of Experience: Between 0 and 10`
    )[0];
    expect(experienceRange).toBeInTheDocument();
  });

});
