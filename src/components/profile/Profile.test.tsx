import {
  fireEvent,
  render,
  RenderResult,
  screen,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'modules';
import { setUser } from 'modules/user';
import { UserData } from 'types';
import Profile from 'components/profile/Profile';

const updatedUser: UserData = {
  displayName: 'test test',
  email: 'test@test.com',
  photoURL: 'photoURL',
  gender: 'male',
  age: 25,
  hostileRating: 2,
  levelOfExperience: 1,
  peerRating: 4,
  interests: ['Running'],
  totalPosts: 0,
  totalProfanities: 0,
  performances: {
    Running: {
      totalDurations: 100,
      totalPractices: 1,
    },
  },
  groups: [],
};

const renderProfile = (): RenderResult =>
  render(
    <Provider store={store}>
      <Profile />
    </Provider>
  );

const setupInterest = () => {
  const utils = renderProfile();
  // eslint-disable-next-line testing-library/prefer-screen-queries
  const input = utils.getByLabelText('interest-input');
  return {
    input,
    ...utils,
  };
};

beforeEach(() => {
  store.dispatch(setUser(updatedUser));
});

describe('<Profile />', () => {
  test('When user clicks Profile button, display profile page.', () => {
    renderProfile();
    const title = screen.getAllByText(
      `${updatedUser?.displayName}'s Profile`
    )[0];
    expect(title).toBeInTheDocument();
  });

  test("Profile page display user's name.", () => {
    renderProfile();
    const selectName = screen.getByDisplayValue(updatedUser.displayName);
    expect(selectName).toBeInTheDocument();
  });

  test("Profile page display user's email.", () => {
    renderProfile();
    const selectEmail = screen.getByDisplayValue(updatedUser.email);
    expect(selectEmail).toBeInTheDocument();
  });

  test("Profile page display user's age.", () => {
    renderProfile();
    const selectAge = screen.getByLabelText('Age');
    expect(selectAge).toBeInTheDocument();
  });

  test("Profile page display user's hostile rating.", () => {
    renderProfile();
    const selectHostileRating = screen.getByLabelText('Hostile Rating');
    expect(selectHostileRating).toBeInTheDocument();
  });

  test("Profile page display user's level of experience.", () => {
    renderProfile();
    const selectLevelOfExperience = screen.getByLabelText(
      'Level of Experience'
    );
    expect(selectLevelOfExperience).toBeInTheDocument();
  });

  test("Profile page display user's peer rating.", () => {
    renderProfile();
    const selectPeerRating = screen.getByLabelText('Peer Rating');
    expect(selectPeerRating).toBeInTheDocument();
  });

  test('User can select any gender in the profile page', () => {
    renderProfile();
    const female = screen.getByLabelText('Female');
    expect(female).toBeInTheDocument();
    const male = screen.getByLabelText('Male');
    expect(male).toBeInTheDocument();
    const both = screen.getByLabelText('Other');
    expect(both).toBeInTheDocument();
  });

  test('User can change input of interest field in profile', () => {
    renderProfile();
    let interestInput = screen.getByTestId('interest-input');
    fireEvent.change(interestInput, { target: { value: 'Testing' } });
    const interest = screen.getByDisplayValue('Testing');
    expect(interest).toBeInTheDocument();
  });
});
