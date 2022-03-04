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
  Paper,
  useTheme,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import db from "../../db";
import { collection, addDoc } from "firebase/firestore";

type CreateGroupFormData = {
  name: string;
  title: string;
  age: number;
  gender: string;
  interestId: string;
  peerRating: number;
  hostileRating: number;
  levelOfExperience: number;
  description: string;
};

function CreateGroup() {
  const theme = useTheme();

  const { control, handleSubmit } = useForm<CreateGroupFormData>();

  const groupsRef = collection(db, "groups");

  const onSubmit = handleSubmit(async (data) => {
    await addDoc(groupsRef, data);
  });

  const getAges = () => {
    const ages: number[] = [];
    for (var i = 1; i <= 80; i++) {
      ages.push(i);
    }
    return ages;
  };

  const getOptions = () => {
    const options: number[] = [];
    for (var i = 1; i <= 10; i++) {
      options.push(i);
    }
    return options;
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          minHeight: 187,
          [theme.breakpoints.up("lg")]: {
            maxHeight: 632,
          },
          overflow: "hidden",
          overflowY: "auto",
        }}
        elevation={4}
      >
        <form onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={4} spacing={4}>
              <FormControl fullWidth>
                <Controller
                  name="name"
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <TextField
                      id="name"
                      label="Name"
                      variant="standard"
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
                  name="title"
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <TextField
                      id="title"
                      label="Title"
                      variant="standard"
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
                <InputLabel id="age-label">Age</InputLabel>
                <Controller
                  name="age"
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <Select
                      id="age"
                      labelId="age-label"
                      type="number"
                      label="Age"
                      name={name}
                      value={value}
                      onChange={onChange}
                      required
                    >
                      {getAges().map((r) => (
                        <MenuItem value={r}>{r}</MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={5} spacing={4}>
              <FormControl fullWidth>
                <FormLabel id="gender-label">Gender</FormLabel>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <RadioGroup
                      row
                      aria-labelledby="gender-label"
                      id="gender"
                      name={name}
                      value={value}
                      onChange={onChange}
                    >
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Female"
                      />
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="both"
                        control={<Radio />}
                        label="Both"
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={7}>
              <FormControl fullWidth>
                <InputLabel id="interest-label">Interest</InputLabel>
                <Controller
                  name="interestId"
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <Select
                      labelId="interest-label"
                      id="interest"
                      type="number"
                      label="Interest"
                      name={name}
                      value={value}
                      onChange={onChange}
                      required
                      defaultValue=""
                    >
                      <MenuItem value={1}>Hiking</MenuItem>                      
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={4} spacing={6}>
              <FormControl fullWidth>
                <InputLabel id="peer-rating-label">Peer Rating</InputLabel>
                <Controller
                  name="peerRating"
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <Select
                      labelId="peer-rating-label"
                      id="peer-rating"
                      type="number"
                      label="PeerRating"
                      name={name}
                      value={value}
                      onChange={onChange}
                      required
                    >
                      {getOptions().map((r) => (
                        <MenuItem value={r}>{r}</MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} spacing={6}>
              <FormControl fullWidth>
                <InputLabel id="hostile-rating-label">
                  Hostile Rating
                </InputLabel>
                <Controller
                  name="hostileRating"
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <Select
                      labelId="hostile-rating-label"
                      id="hostile-rating"
                      type="number"
                      label="HostileRating"
                      name={name}
                      value={value}
                      onChange={onChange}
                      required
                    >
                      {getOptions().map((r) => (
                        <MenuItem value={r}>{r}</MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4} spacing={6}>
              <FormControl fullWidth>
                <InputLabel id="level-of-experience-label">
                  Level of Experience
                </InputLabel>
                <Controller
                  name="levelOfExperience"
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <Select
                      labelId="level-of-experience-label"
                      id="level-of-experience"
                      type="number"
                      label="LevelOfExperience"
                      name={name}
                      value={value}
                      onChange={onChange}
                      required
                    >
                      {getOptions().map((r) => (
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
                  name="description"
                  control={control}
                  render={({ field: { name, value, onChange } }) => (
                    <TextField
                      id="group-description"
                      label="Description"
                      multiline
                      rows={4}
                      name={name}
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <Button variant="contained" id="submit" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default CreateGroup;
