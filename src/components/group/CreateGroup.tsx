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
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import db from '../../db';
import { auth } from 'db';
import { collection, addDoc } from 'firebase/firestore';
import { getLoggedInUser } from 'db/repository/user';
import { useState, useEffect } from 'react';
import { UserData } from 'types';

type CreateGroupFormData = {
  name: string;
  title: string;
  minAge: number;
  maxAge: number;
  gender: string;
  owner: string;
  interest: string;
  peerRatingMin: number;
  peerRatingMax: number;
  hostileRatingMin: number;
  hostileRatingMax: number;
  levelOfExperienceMin: number;
  levelOfExperienceMax: number;
  description: string;
};

type CreatGroupProps = {
  open: boolean;
  onClose: (event: any, reason: any) => void;
};

function CreateGroup({ open, onClose }: CreatGroupProps) {
  const [user, setUser] = useState<UserData>();

  const { control, reset, handleSubmit } = useForm<CreateGroupFormData>();

  const groupsRef = collection(db, 'groups');

  useEffect(() => {
    const getUser = async () => {
      const currentUser = auth.currentUser || { uid: '' };
      const user = await getLoggedInUser({
        uid: currentUser.uid,
        displayName: '',
        email: '',
        photoURL: '',
      });
      setUser(user);
    };
    getUser();
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    data.minAge = user?.age || 0;
    data.owner = user?.email || '';
    data.hostileRatingMin = user?.hostileRating || 0;
    data.peerRatingMin = user?.peerRating || 0;
    data.levelOfExperienceMin = user?.levelOfExperience || 0;

    data.gender = data.gender || user?.gender || '';
    data.maxAge = data.maxAge || data.minAge;
    data.interest = data.interest || user?.interests[0] || '';
    data.hostileRatingMax = data.hostileRatingMax || data.hostileRatingMin;
    data.peerRatingMax = data.peerRatingMax || data.peerRatingMin;
    data.levelOfExperienceMax =
      data.levelOfExperienceMax || data.levelOfExperienceMin;
    reset();
    onClose(null, null);
    await addDoc(groupsRef, data);
  });

  const getAges = (min: number) => {
    const ages: number[] = [];
    for (var i = 0; i <= 10; i++) {
      ages.push(min + i);
    }
    return ages;
  };

  const getOptions = (min: number, max: number) => {
    const options: number[] = [];
    for (var i = min; i <= max; i++) {
      options.push(i);
    }
    return options;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>Create Group Form</DialogTitle>
      <DialogContent>
        <form id='create-group-form' onSubmit={onSubmit}>
          <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={4} spacing={4}>
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

              <Grid item xs={4} spacing={6}>
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

              <Grid item xs={4} spacing={4}>
                <FormControl fullWidth>
                  <InputLabel id='age-label'>Age</InputLabel>
                  <Controller
                    name='maxAge'
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <Select
                        id='maxAge'
                        labelId='age-label'
                        type='number'
                        label='Age'
                        name={name}
                        value={value}
                        onChange={onChange}
                        defaultValue={user?.age}
                        required
                      >
                        {user &&
                          getAges(user.age).map((r) => (
                            <MenuItem value={r}>{r}</MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={5} spacing={4}>
                <FormControl fullWidth>
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
                          control={<Radio />}
                          label='Female'
                          disabled={user?.gender === 'male'}
                        />
                        <FormControlLabel
                          value='male'
                          control={<Radio />}
                          label='Male'
                          disabled={user?.gender === 'female'}
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

              <Grid item xs={7}>
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
                          user.interests.map((interest) => (
                            <MenuItem value={interest}>{interest}</MenuItem>
                          ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={4} spacing={6}>
                <FormControl fullWidth>
                  <InputLabel id='peer-rating-label'>Peer Rating</InputLabel>
                  <Controller
                    name='peerRatingMax'
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <Select
                        labelId='peer-rating-label'
                        id='peer-rating'
                        type='number'
                        label='PeerRating'
                        name={name}
                        value={value}
                        onChange={onChange}
                        defaultValue={user?.peerRating}
                        required
                      >
                        {getOptions(
                          user?.peerRating || 0,
                          (user?.peerRating || 0) + 2
                        ).map((r) => (
                          <MenuItem value={r}>{r}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={4} spacing={6}>
                <FormControl fullWidth>
                  <InputLabel id='hostile-rating-label'>
                    Hostile Rating
                  </InputLabel>
                  <Controller
                    name='hostileRatingMax'
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <Select
                        labelId='hostile-rating-label'
                        id='hostile-rating'
                        type='number'
                        label='HostileRating'
                        name={name}
                        value={value}
                        onChange={onChange}
                        defaultValue={user?.hostileRating}
                        required
                      >
                        {getOptions(
                          user?.hostileRating || 0,
                          (user?.hostileRating || 0) + 2
                        ).map((r) => (
                          <MenuItem value={r}>{r}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={4} spacing={6}>
                <FormControl fullWidth>
                  <InputLabel id='level-of-experience-label'>
                    Level of Experience
                  </InputLabel>
                  <Controller
                    name='levelOfExperienceMax'
                    control={control}
                    render={({ field: { name, value, onChange } }) => (
                      <Select
                        labelId='level-of-experience-label'
                        id='level-of-experience'
                        type='number'
                        label='LevelOfExperience'
                        name={name}
                        value={value}
                        onChange={onChange}
                        defaultValue={user?.levelOfExperience}
                        required
                      >
                        {getOptions(
                          user?.levelOfExperience || 0,
                          (user?.levelOfExperience || 0) + 3
                        ).map((r) => (
                          <MenuItem value={r}>{r}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
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
        <Button variant='contained' onClick={() => onClose(null, null)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateGroup;
