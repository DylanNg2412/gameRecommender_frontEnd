import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  CircularProgress,
  Autocomplete,
  createTheme,
  ThemeProvider,
  Grid,
  Chip,
  InputAdornment,
  Alert,
  Snackbar,
  Fade,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import StarIcon from "@mui/icons-material/Star";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HomePage() {
  const [selectedGame, setSelectedGame] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [gameOptions, setGameOptions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#bb86fc" : "#6200ea",
      },
      secondary: {
        main: darkMode ? "#03dac6" : "#00bfa5",
      },
      background: {
        default: darkMode ? "#121212" : "#f5f5f5",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h3: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const showNotification = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Fetch the list of game options from the backend
  useEffect(() => {
    const getGames = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/games");
        if (response.data.games) {
          // Backend now returns array of strings directly
          setGameOptions(response.data.games);
        }
      } catch (error) {
        console.error("Error fetching game options:", error);
        showNotification(
          "Failed to load game options. Please refresh the page.",
          "error"
        );
      }
    };
    getGames();
  }, []);

  // Handle recommendations
  const handleRecommend = async () => {
    if (selectedGame || inputValue) {
      const gameName = selectedGame || inputValue;
      setIsLoading(true);
      try {
        const response = await axios.post("http://127.0.0.1:5000/recommend", {
          selectedGame: gameName,
        });
        setRecommendations(response.data.recommendations || []);
        setShowRecommendations(true);
        if (response.data.recommendations?.length > 0) {
          showNotification(
            `Found ${response.data.recommendations.length} recommendations! `,
            "success"
          );
        }
      } catch (error) {
        showNotification(
          "Failed to fetch recommendations.  Please try again.",
          "error"
        );
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      showNotification("Please select a game!", "warning");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "error";
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          transition: "background-color 0.3s ease",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: darkMode
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            py: 6,
            px: 3,
            boxShadow: 3,
          }}
        >
          <Container maxWidth="lg">
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item xs={12} md={8}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <SportsEsportsIcon sx={{ fontSize: 48 }} />
                  <Typography variant="h3" component="h1">
                    Game Finder
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Discover your next favorite game based on what you love
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                md={4}
                textAlign={{ xs: "left", md: "right" }}
                mt={{ xs: 2, md: 0 }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={darkMode}
                      onChange={toggleDarkMode}
                      sx={{
                        "& .MuiSwitch-thumb": {
                          backgroundColor: "white",
                        },
                      }}
                    />
                  }
                  label={darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
                  sx={{ color: "white" }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* Search Section */}
          <Card
            elevation={3}
            sx={{
              p: 4,
              mb: 4,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight={600} mb={3}>
              🎮 Choose a game you love
            </Typography>

            <Autocomplete
              options={gameOptions}
              freeSolo
              value={selectedGame}
              inputValue={inputValue}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search for a game..."
                  variant="outlined"
                  fullWidth
                  placeholder="e.g., The Witcher 3, Minecraft, Cyberpunk 2077"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              onChange={(event, newValue) => {
                // This handles selection from dropdown
                setSelectedGame(newValue || "");
                setInputValue(newValue || "");
                setShowRecommendations(false);
              }}
              onInputChange={(event, newValue) => {
                // This handles typing in the input
                setInputValue(newValue);
                setShowRecommendations(false);
              }}
              // Show suggestions as user types
              openOnFocus
              // Limit the number of visible options for better UX
              ListboxProps={{
                style: { maxHeight: "300px" },
              }}
              // Fixed: renderOption now handles string options correctly
              renderOption={(props, option) => {
                // Destructure key from props
                const { key, ...otherProps } = props;
                return (
                  <Box component="li" key={key} {...otherProps}>
                    <SportsEsportsIcon
                      sx={{ mr: 1, fontSize: 20, color: "text.secondary" }}
                    />
                    {option}
                  </Box>
                );
              }}
            />

            <Button
              variant="contained"
              size="large"
              disabled={!selectedGame && !inputValue}
              onClick={handleRecommend}
              startIcon={<RocketLaunchIcon />}
              sx={{
                marginTop: 3,
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1.1rem",
                background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                boxShadow: "0 3px 5px 2px rgba(102, 126, 234, . 3)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #764ba2 30%, #667eea 90%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 5px 10px 2px rgba(102, 126, 234, .4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Get Recommendations
            </Button>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Fade in={isLoading}>
              <Box textAlign="center" py={6}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" mt={3} color="text.secondary">
                  Finding the best games for you...
                </Typography>
              </Box>
            </Fade>
          )}

          {/* Recommendations */}
          {showRecommendations && !isLoading && recommendations.length > 0 && (
            <Fade in={showRecommendations}>
              <Box>
                <Typography variant="h4" gutterBottom fontWeight={700} mb={3}>
                  🎯 Recommended Games
                </Typography>
                <Grid container spacing={3}>
                  {recommendations.map((game, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                      <Card
                        elevation={2}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: 8,
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            fontWeight={600}
                          >
                            {game.name || "N/A"}
                          </Typography>

                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1}
                          >
                            <CalendarMonthIcon
                              fontSize="small"
                              color="action"
                            />
                            <Typography variant="body2" color="text.secondary">
                              {game.release_date || "Unknown"}
                            </Typography>
                          </Box>

                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={2}
                          >
                            <AttachMoneyIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {game.price || "N/A"}
                            </Typography>
                          </Box>

                          {game.score && (
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mb={2}
                            >
                              <Chip
                                icon={<StarIcon />}
                                label={`${game.score}%`}
                                color={getScoreColor(game.score)}
                                size="small"
                              />
                            </Box>
                          )}

                          {game.genres && (
                            <Box mb={1}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                mb={0.5}
                              >
                                Genres:
                              </Typography>
                              <Box display="flex" gap={0.5} flexWrap="wrap">
                                {game.genres
                                  .split(",")
                                  .slice(0, 3)
                                  .map((genre, i) => (
                                    <Chip
                                      key={i}
                                      label={genre.trim()}
                                      size="small"
                                      variant="outlined"
                                      color="primary"
                                    />
                                  ))}
                              </Box>
                            </Box>
                          )}

                          {game.tags && (
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                mb={0.5}
                              >
                                Tags:
                              </Typography>
                              <Box display="flex" gap={0.5} flexWrap="wrap">
                                {game.tags
                                  .split(",")
                                  .slice(0, 3)
                                  .map((tag, i) => (
                                    <Chip
                                      key={i}
                                      label={tag.trim()}
                                      size="small"
                                      variant="outlined"
                                      color="secondary"
                                    />
                                  ))}
                              </Box>
                            </Box>
                          )}

                          {game.reviews && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              mt={2}
                              display="block"
                            >
                              📝 {game.reviews} reviews
                            </Typography>
                          )}

                          {game.popularity && (
                            <Typography
                              variant="caption"
                              color="text. secondary"
                              display="block"
                            >
                              🔥 Popularity: {game.popularity}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          )}

          {/* No Results */}
          {showRecommendations &&
            !isLoading &&
            recommendations.length === 0 && (
              <Fade in={showRecommendations}>
                <Card elevation={2} sx={{ p: 6, textAlign: "center" }}>
                  <Typography variant="h5" gutterBottom color="text.secondary">
                    😔 No recommendations found
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Try searching for a different game!
                  </Typography>
                </Card>
              </Fade>
            )}
        </Container>

        {/* Snackbar for notifications */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
