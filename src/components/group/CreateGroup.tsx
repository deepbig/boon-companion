import {
  Container,
  Grid,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Typography,
  Snackbar,
  IconButton,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import db from '../../db';
// import { auth } from 'db';
import { collection, addDoc } from 'firebase/firestore';
// import { updateUserHostileRating } from 'db/repository/user';
import { useState, useEffect } from 'react';
import { CreateGroupFormData, GroupData } from 'types';
import { useAppSelector } from 'hooks';
import { getUser } from 'modules/user';
import CloseIcon from '@mui/icons-material/Close';
// import { checkProfanityWords } from 'lib/common';
// import { getProfanityList } from 'modules/profanity';

type CreatGroupProps = {
  open: boolean;
  onClose: (event: any, reason: any) => void;
};

function CreateGroup({ open, onClose }: CreatGroupProps) {
  const [age, setAge] = useState<number[]>([0, 100]);
  const [peerRating, setPeerRating] = useState<number[]>([0, 10]);
  const [levelOfExperience, setLevelOfExperience] = useState<number[]>([0, 10]);
  const [hostileRating, setHostileRating] = useState<number[]>([0, 10]);
  const user = useAppSelector(getUser);
  const [openMessage, setOpenMessage] = useState(false);
  const [message, setMessage] = useState('');
  // const currentUser = auth.currentUser;
  // const profanityList = useAppSelector(getProfanityList);

  const { control, reset, handleSubmit } = useForm<CreateGroupFormData>();

  const groupsRef = collection(db, 'groups');

  useEffect(() => {
    if (user) {
      setAge([user?.age || 0, 120]);
      setPeerRating([0, user?.peerRating || 10]);
      setLevelOfExperience([0, user?.levelOfExperience || 10]);
      setHostileRating([user?.hostileRating || 0, 10]);
    }
  }, [user]);

  const onAgeChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    const myValue = user?.age ? user.age : 0;
    const rangeValue = newValue as number[];
    if (myValue >= rangeValue[0] && myValue <= rangeValue[1]) {
      setAge(rangeValue);
    }
  };

  const onPeerRatingChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    const myValue = user?.peerRating ? user.peerRating : 10;

    if (newValue[1] <= myValue) {
      setPeerRating([newValue[0], newValue[1]]);
    }
  };

  const onLevelOfExperienceChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[0] <= levelOfExperience[1]) {
      setLevelOfExperience([newValue[0], levelOfExperience[1]]);
    }
  };

  const onHostileRatingChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    const myValue = user?.hostileRating ? user.hostileRating : 0;

    if (newValue[0] >= myValue) {
      setHostileRating([newValue[0], newValue[1]]);
    }
  };

  const handleCloseMessage = () => {
    setOpenMessage(false);
    setMessage('');
  };

  const actionMessage = (
    <IconButton
      size='small'
      aria-label='close'
      color='inherit'
      onClick={handleCloseMessage}
    >
      <CloseIcon fontSize='small' />
    </IconButton>
  );

  const onSubmit = handleSubmit(async (data) => {
    const newGroupData: GroupData = {
      name: data.name,
      title: data.title,
      gender: data.gender || user?.gender || 'both',
      interest: data.interest || user?.interests[0] || '',
      owner: user?.email || '',
      minAge: (data.age && data.age[0]) || age[0],
      maxAge: (data.age && data.age[1]) || age[1],
      peerRatingMin: (data.peerRating && data.peerRating[0]) || peerRating[0],
      peerRatingMax: (data.peerRating && data.peerRating[1]) || peerRating[1],
      hostileRatingMin:
        (data.hostileRating && data.hostileRating[0]) || hostileRating[0],
      hostileRatingMax:
        (data.hostileRating && data.hostileRating[1]) || hostileRating[1],
      levelOfExperienceMin:
        (data.levelOfExperience && data.levelOfExperience[0]) ||
        levelOfExperience[0],
      levelOfExperienceMax:
        (data.levelOfExperience && data.levelOfExperience[1]) ||
        levelOfExperience[1],
      description: data.description || '',
      members: [],
      notes: [],
    };

    try {
      await addDoc(groupsRef, newGroupData);
      onClose(null, null);
      resetData();
      alert(`Group is successfully created!`);
    } catch (e) {
      setMessage(
        `Failed to create group due to an internal database error. Please try again.`
      );
      setOpenMessage(true);
    }

    // if (user && currentUser) {
    //   let totalProfanities = user.totalProfanities ? user.totalProfanities : 0;
    //   if (await checkProfanityWords(description, profanityList)) {
    //     totalProfanities++;
    //   }
    //   await updateUserHostileRating(
    //     currentUser.uid,
    //     user.totalPosts ? user.totalPosts + 1 : 1,
    //     totalProfanities
    //   );
    // }
  });

  const resetData = () => {
    setAge([user?.age || 0, 120]);
    setPeerRating([0, user?.peerRating || 10]);
    setLevelOfExperience([0, user?.levelOfExperience || 10]);
    setHostileRating([user?.hostileRating || 0, 10]);
    reset();
  };

  return (
    <>
      <div>
        <Dialog open={open} onClose={onClose}>
          <DialogTitle sx={{ textAlign: 'center' }}>
            Create Group Form
          </DialogTitle>
          <DialogContent>
            <form id='create-group-form' onSubmit={onSubmit}>
              <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={4}>
                  <Grid item xs={6} style={{ paddingLeft: 20 }}>
                    <FormControl fullWidth>
                      <Controller
                        name='name'
                        control={control}
                        render={({ field: { name, value, onChange } }) => (
                          <TextField
                            id='name'
                            label='Name'
                            variant='standard'
                            name={name}
                            value={value}
                            onChange={onChange}
                            required
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Controller
                        name='title'
                        control={control}
                        render={({ field: { name, value, onChange } }) => (
                          <TextField
                            id='title'
                            label='Title'
                            variant='standard'
                            name={name}
                            value={value}
                            onChange={onChange}
                            required
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={7} style={{ paddingLeft: 20 }}>
                    <FormControl>
                      <FormLabel id='gender-label'>Gender</FormLabel>
                      <Controller
                        name='gender'
                        control={control}
                        render={({ field: { name, value, onChange } }) => (
                          <RadioGroup
                            row
                            aria-labelledby='gender-label'
                            id='gender'
                            name={name}
                            value={value}
                            onChange={onChange}
                            defaultValue={user?.gender}
                          >
                            <FormControlLabel
                              value='female'
                              disabled={
                                !user?.gender || !(user?.gender === 'female')
                              }
                              control={<Radio />}
                              label='Female'
                            />
                            <FormControlLabel
                              value='male'
                              disabled={
                                !user?.gender || !(user?.gender === 'male')
                              }
                              control={<Radio />}
                              label='Male'
                            />
                            <FormControlLabel
                              value='other'
                              disabled={
                                !user?.gender || !(user?.gender === 'other')
                              }
                              control={<Radio />}
                              label='Other'
                            />
                            <FormControlLabel
                              value='both'
                              control={<Radio />}
                              label='Both'
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={5} style={{ paddingLeft: 0 }}>
                    <FormControl fullWidth>
                      <InputLabel id='interest-label'>Interest</InputLabel>
                      <Controller
                        name='interest'
                        control={control}
                        render={({ field: { name, value, onChange } }) => (
                          <Select
                            labelId='interest-label'
                            id='interest'
                            type='number'
                            label='Interest'
                            name={name}
                            value={value}
                            onChange={onChange}
                            defaultValue={user?.interests[0]}
                            required
                          >
                            {user &&
                              user.interests.map((interest, i) => (
                                <MenuItem key={i} value={interest}>
                                  {interest}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Typography id='age-label' gutterBottom>
                        Age
                      </Typography>
                      <Controller
                        name='age'
                        control={control}
                        render={({ field: { name } }) => (
                          <Slider
                            id='age'
                            name={name}
                            max={120}
                            value={age}
                            valueLabelDisplay='auto'
                            onChange={onAgeChange}
                            disableSwap
                            marks={[
                              {
                                value: age[0],
                                label: age[0],
                              },
                              {
                                value: age[1],
                                label: age[1],
                              },
                            ]}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Typography id='peer-rating-label' gutterBottom>
                        Peer Rating
                      </Typography>
                      <Controller
                        name='peerRating'
                        control={control}
                        render={({ field: { name } }) => (
                          <Slider
                            id='peerRating'
                            name={name}
                            max={10}
                            value={peerRating}
                            valueLabelDisplay='auto'
                            onChange={onPeerRatingChange}
                            disableSwap
                            step={0.1}
                            marks={[
                              {
                                value: peerRating[0],
                                label: peerRating[0],
                              },
                              {
                                value: peerRating[1],
                                label: peerRating[1],
                              },
                            ]}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Typography id='hostile-rating-label' gutterBottom>
                        Hostile Rating
                      </Typography>
                      <Controller
                        name='hostileRating'
                        control={control}
                        render={({ field: { name } }) => (
                          <Slider
                            id='hostileRating'
                            name={name}
                            max={10}
                            value={hostileRating}
                            valueLabelDisplay='auto'
                            onChange={onHostileRatingChange}
                            disableSwap
                            step={0.1}
                            marks={[
                              {
                                value: hostileRating[0],
                                label: hostileRating[0],
                              },
                              {
                                value: hostileRating[1],
                                label: hostileRating[1],
                              },
                            ]}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <Typography id='level-of-experience-label' gutterBottom>
                        Level of Experience
                      </Typography>
                      <Controller
                        name='levelOfExperience'
                        control={control}
                        render={({ field: { name } }) => (
                          <Slider
                            id='levelOfExperience'
                            name={name}
                            max={10}
                            value={levelOfExperience}
                            valueLabelDisplay='auto'
                            onChange={onLevelOfExperienceChange}
                            disableSwap
                            marks={[
                              {
                                value: levelOfExperience[0],
                                label: levelOfExperience[0],
                              },
                              {
                                value: levelOfExperience[1],
                                label: levelOfExperience[1],
                              },
                            ]}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} style={{ paddingLeft: 20 }}>
                    <FormControl fullWidth>
                      <Controller
                        name='description'
                        control={control}
                        render={({ field: { name, value, onChange } }) => (
                          <TextField
                            id='group-description'
                            label='Description'
                            multiline
                            rows={2}
                            name={name}
                            value={value}
                            onChange={onChange}
                          />
                        )}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Container>
            </form>
          </DialogContent>
          <DialogActions>
            <Button variant='contained' type='submit' form='create-group-form'>
              Submit
            </Button>
            <Button
              variant='contained'
              onClick={() => {
                resetData();
                onClose(null, null);
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={openMessage}
          autoHideDuration={5000}
          onClose={handleCloseMessage}
          message={message}
          action={actionMessage}
        />
      </div>
    </>
  );
}

export default CreateGroup;
