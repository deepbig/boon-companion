import { render, RenderResult, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'modules';
import { setUser } from 'modules/user';
import { UserData } from 'types';
import ActivityPerformance from 'components/activityPerformance/ActivityPerformance';
import { setSelectedInterest } from 'modules/interests';

const newUser: UserData = {
  displayName: 'test test',
  email: 'test@test.com',
  photoURL: 'photoURL',
  gender: null,
  age: 25,
  hostileRating: 2,
  levelOfExperience: 3,
  peerRating: 4,
  interests: ['Running'],
  totalPosts: 0,
  totalProfanities: 0,
  performances: {},
  groups: [],
};

const updatedUser: UserData = {
  displayName: 'test test',
  email: 'test@test.com',
  photoURL: 'photoURL',
  gender: null,
  age: 25,
  hostileRating: 2,
  levelOfExperience: 3,
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

const renderActivityPerformance = (): RenderResult =>
  render(
    <Provider store={store}>
      <ActivityPerformance />
    </Provider>
  );

beforeEach(() => {
  store.dispatch(setUser(newUser));
  store.dispatch(setSelectedInterest('Running'));
});

describe('<ActivityPerformance />', () => {
  test('If there are no user info, display default value of performance.', () => {
    renderActivityPerformance();
    store.dispatch(setUser(null));
    const totalPractices = screen.getAllByText(`0 practices`)[0];
    expect(totalPractices).toBeInTheDocument();
    const totalDurations = screen.getAllByText(`0 mins (Level 0)`)[0];
    expect(totalDurations).toBeInTheDocument();
  });

  test('If there are no selected interest, display default value of performance.', () => {
    renderActivityPerformance();
    store.dispatch(setSelectedInterest(''));
    const totalPractices = screen.getAllByText(`0 practices`)[0];
    expect(totalPractices).toBeInTheDocument();
    const totalDurations = screen.getAllByText(`0 mins (Level 0)`)[0];
    expect(totalDurations).toBeInTheDocument();
  });

  test('When user has performance data, display the performance value.', () => {
    store.dispatch(setUser(updatedUser));
    renderActivityPerformance();
    const totalPractices = screen.getAllByText(
      `${updatedUser.performances['Running'].totalPractices} practices`
    )[0];
    expect(totalPractices).toBeInTheDocument();
    let totalDurations: any =
      updatedUser.performances['Running'].totalDurations;
    totalDurations = screen.getAllByText(
      `${
        totalDurations >= 60
          ? (totalDurations / 60).toFixed(1) + ' hours'
          : totalDurations + ' mins'
      } (Level ${
        totalDurations > 600000 ? '10' : Math.ceil(totalDurations / 60000)
      })`
    )[0];
    expect(totalDurations).toBeInTheDocument();
  });

  test("When user's performance data updated, display the performance value.", () => {
    store.dispatch(setUser(updatedUser));
    renderActivityPerformance();
    let user = {
      ...updatedUser,
      performances: {
        Running: {
          totalPractices: 2,
          totalDurations: 120,
        },
      },
    };
    store.dispatch(setUser(user));
    renderActivityPerformance();
    const totalPractices = screen.getAllByText(
      `${user.performances['Running'].totalPractices} practices`
    )[0];
    expect(totalPractices).toBeInTheDocument();
    let totalDurations: any = user.performances['Running'].totalDurations;
    totalDurations = screen.getAllByText(
      `${
        totalDurations >= 60
          ? (totalDurations / 60).toFixed(1) + ' hours'
          : totalDurations + ' mins'
      } (Level ${
        totalDurations > 600000 ? '10' : Math.ceil(totalDurations / 60000)
      })`
    )[0];
    expect(totalDurations).toBeInTheDocument();
  });

  // test('When user open Join a Group from, display Interest selection', () => {
  //   renderJoinGroup();
  //   let groupInterest = screen.getByTestId('joinGroup-interest');
  //   expect(groupInterest).toBeInTheDocument();
  // });

  // test('When user does not have gender, display gender selection with disabled', () => {
  //   renderJoinGroup();
  //   const female = screen.getByLabelText('Female');
  //   expect(female).toHaveAttribute('disabled');
  //   const male = screen.getByLabelText('Male');
  //   expect(male).toHaveAttribute('disabled');
  //   const other = screen.getByLabelText('Other');
  //   expect(other).toHaveAttribute('disabled');
  //   const both = screen.getByLabelText('Both');
  //   expect(both).not.toHaveAttribute('disabled');
  // });

  // test('When user is male, only male and both gender selection is enabled', () => {
  //   let maleUser = Object.assign({}, newUser);
  //   maleUser.gender = 'male';
  //   store.dispatch(setUser(maleUser));
  //   renderJoinGroup();
  //   const female = screen.getByLabelText('Female');
  //   expect(female).toHaveAttribute('disabled');
  //   const male = screen.getByLabelText('Male');
  //   expect(male).not.toHaveAttribute('disabled');
  //   const other = screen.getByLabelText('Other');
  //   expect(other).toHaveAttribute('disabled');
  //   const both = screen.getByLabelText('Both');
  //   expect(both).not.toHaveAttribute('disabled');
  // });

  // test('When user have age, display age slider from 0 to 120', () => {
  //   renderJoinGroup();
  //   const ageRange = screen.getAllByText(`Age: Between 0 and 120`)[0];
  //   expect(ageRange).toBeInTheDocument();
  // });

  // test('When user have peer rating, display peer rating slider from 0 to 10', () => {
  //   renderJoinGroup();
  //   const peerRatingRange = screen.getAllByText(
  //     `Peer Rating: Between 0 and 10`
  //   )[0];
  //   expect(peerRatingRange).toBeInTheDocument();
  // });

  // test('When user have Hostile rating, display Hostile Rating slider from 0 to 10', () => {
  //   renderJoinGroup();
  //   const hostileRatingRange = screen.getAllByText(
  //     `Hostile Rating: Between 0 and 10`
  //   )[0];
  //   expect(hostileRatingRange).toBeInTheDocument();
  // });

  // test('When user have Level of Experience, display Level of Experience slider from 0 to 10', () => {
  //   renderJoinGroup();
  //   const experienceRange = screen.getAllByText(
  //     `Level of Experience: Between 0 and 10`
  //   )[0];
  //   expect(experienceRange).toBeInTheDocument();
  // });
});
