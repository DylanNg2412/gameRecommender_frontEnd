import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Autocomplete,
  createTheme,
  ThemeProvider,
  Grid,
  Chip,
  InputAdornment,
  Alert,
  Snackbar,
  Fade,
  Skeleton,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import {
  useState,
  useEffect,
  useDeferredValue,
  useMemo,
  useCallback,
} from "react";
import api from "../../utils/api";

const QUICK_PICKS = [
  "Hollow Knight",
  "Stardew Valley",
  "Dark Souls",
  "Portal 2",
];

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

  const deferredInputValue = useDeferredValue(inputValue);

  const visibleGameOptions = useMemo(() => {
    const query = deferredInputValue.trim().toLowerCase();
    if (!query) return gameOptions.slice(0, 25);
    return gameOptions
      .filter((g) => g.toLowerCase().includes(query))
      .slice(0, 25);
  }, [gameOptions, deferredInputValue]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#9B8FE8" : "#4A3FB5" },
      secondary: { main: darkMode ? "#5EC4A8" : "#0F6E56" },
      background: {
        default: darkMode ? "#0F0F13" : "#F4F3FF",
        paper: darkMode ? "#1A1A24" : "#FFFFFF",
      },
      success: { main: "#3B6D11" },
      warning: { main: "#854F0B" },
      error: { main: "#A32D2D" },
    },
    typography: {
      fontFamily: '"DM Sans", "Roboto", "Helvetica", sans-serif',
      h3: { fontWeight: 700, letterSpacing: "-0.5px" },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            border: darkMode
              ? "0.5px solid rgba(255,255,255,0.08)"
              : "0.5px solid rgba(0,0,0,0.08)",
            boxShadow: "none",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 500 },
        },
      },
    },
  });

  const showNotification = (message, severity = "info") => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification((n) => ({ ...n, open: false }));
  };

  useEffect(() => {
    api
      .get("/games")
      .then((res) => {
        if (res.data.games) setGameOptions(res.data.games);
      })
      .catch(() =>
        showNotification(
          "Failed to load game options. Please refresh.",
          "error",
        ),
      );
  }, []);

  const handleRecommend = useCallback(
    async (gameName) => {
      const name = gameName || selectedGame || inputValue;
      if (!name) {
        showNotification("Please select or type a game first.", "warning");
        return;
      }
      setInputValue(name);
      setSelectedGame(name);
      setIsLoading(true);
      setShowRecommendations(true);
      try {
        const response = await api.post("/recommend", { selectedGame: name });
        const recs = response.data.recommendations || [];
        setRecommendations(recs);
        if (recs.length > 0) {
          showNotification(
            `Found ${recs.length} recommendations for "${name}"`,
            "success",
          );
        }
      } catch {
        showNotification(
          "Failed to fetch recommendations. Please try again.",
          "error",
        );
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedGame, inputValue],
  );

  const getScoreBg = (score) => {
    if (score >= 80) return darkMode ? "#1a2e0f" : "#EAF3DE";
    if (score >= 60) return darkMode ? "#2e1f0a" : "#FAEEDA";
    return darkMode ? "#2e0f0f" : "#FCEBEB";
  };

  const getScoreText = (score) => {
    if (score >= 80) return darkMode ? "#8BC34A" : "#3B6D11";
    if (score >= 60) return darkMode ? "#FFA726" : "#854F0B";
    return darkMode ? "#EF5350" : "#A32D2D";
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default,
          transition: "background-color 0.3s",
        }}
      >
        {/* Top Bar */}
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderBottom: darkMode
              ? "0.5px solid rgba(255,255,255,0.08)"
              : "0.5px solid rgba(0,0,0,0.07)",
            px: 3,
            py: 1.5,
          }}
        >
          <Container maxWidth="lg">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    background: "#3C3489",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SportsEsportsIcon sx={{ color: "#EEEDFE", fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    lineHeight={1.2}
                    sx={{ color: darkMode ? "#EEEDFE" : "#1F1C3D" }}
                  >
                    Game Finder
                  </Typography>
                  <Typography
                    variant="caption"
                    lineHeight={1}
                    sx={{
                      color: darkMode
                        ? "rgba(238, 237, 254, 0.72)"
                        : "text.secondary",
                    }}
                  >
                    Discover your next favorite
                  </Typography>
                </Box>
              </Box>

              <Tooltip
                title={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                <Box
                  onClick={() => setDarkMode(!darkMode)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    px: 1.5,
                    py: 0.75,
                    borderRadius: "8px",
                    border: darkMode
                      ? "0.5px solid rgba(255,255,255,0.12)"
                      : "0.5px solid rgba(0,0,0,0.1)",
                    "&:hover": {
                      backgroundColor: darkMode
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.04)",
                    },
                    transition: "background 0.15s",
                  }}
                >
                  {darkMode ? (
                    <DarkModeIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                  ) : (
                    <LightModeIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {darkMode ? "Dark" : "Light"}
                  </Typography>
                </Box>
              </Tooltip>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Search Section */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              Enter a game you love and we'll find similar ones
            </Typography>

            <Box
              display="flex"
              gap={1.5}
              flexDirection={{ xs: "column", sm: "row" }}
            >
              <Autocomplete
                sx={{ flex: 1 }}
                options={visibleGameOptions}
                freeSolo
                value={selectedGame}
                inputValue={inputValue}
                filterOptions={(options) => options}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="e.g. The Witcher 3, Minecraft, Cyberpunk 2077…"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRecommend();
                    }}
                  />
                )}
                onChange={(_, newValue) => {
                  setSelectedGame(newValue || "");
                  setInputValue(newValue || "");
                  setShowRecommendations(false);
                }}
                onInputChange={(_, newValue) => {
                  setInputValue(newValue);
                  setShowRecommendations(false);
                }}
                openOnFocus
                ListboxProps={{ style: { maxHeight: "300px" } }}
                renderOption={(props, option) => {
                  const { key, ...rest } = props;
                  return (
                    <Box component="li" key={key} {...rest}>
                      <SportsEsportsIcon
                        sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                      />
                      {option}
                    </Box>
                  );
                }}
              />

              <Button
                variant="contained"
                size="medium"
                onClick={() => handleRecommend()}
                startIcon={<AutoAwesomeIcon />}
                disabled={!selectedGame && !inputValue}
                sx={{
                  px: 3,
                  background: "#3C3489",
                  whiteSpace: "nowrap",
                  "&:hover": { background: "#26215C" },
                  "&:disabled": { opacity: 0.5 },
                }}
              >
                Find games
              </Button>
            </Box>

            {/* Quick picks */}
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              mt={1.5}
              flexWrap="wrap"
            >
              <Typography variant="caption" color="text.disabled">
                Try:
              </Typography>
              {QUICK_PICKS.map((name) => (
                <Chip
                  key={name}
                  label={name}
                  size="small"
                  variant="outlined"
                  onClick={() => handleRecommend(name)}
                  icon={<SportsEsportsIcon style={{ fontSize: 13 }} />}
                  sx={{
                    fontSize: 11,
                    height: 24,
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#534AB7",
                      color: "#3C3489",
                      backgroundColor: "#EEEDFE",
                    },
                  }}
                />
              ))}
            </Box>
          </Card>

          {/* Results Header */}
          {showRecommendations && (
            <Box
              display="flex"
              alignItems="baseline"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="h6">
                {isLoading
                  ? `Searching for "${inputValue}"…`
                  : `Based on "${inputValue}"`}
              </Typography>
              {!isLoading && recommendations.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {recommendations.length} games found
                </Typography>
              )}
            </Box>
          )}

          {/* Skeleton Loading */}
          {isLoading && (
            <Grid container spacing={2}>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Card sx={{ p: 2 }}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb={1.5}
                      >
                        <Skeleton variant="text" width="60%" height={20} />
                        <Skeleton variant="rounded" width={42} height={26} />
                      </Box>
                      <Skeleton
                        variant="rounded"
                        height={52}
                        sx={{ mb: 1.5 }}
                      />
                      <Box display="flex" gap={1} mb={1.5}>
                        <Skeleton variant="text" width={60} />
                        <Skeleton variant="text" width={80} />
                      </Box>
                      <Box display="flex" gap={0.75}>
                        <Skeleton variant="rounded" width={60} height={22} />
                        <Skeleton variant="rounded" width={50} height={22} />
                        <Skeleton variant="rounded" width={55} height={22} />
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mt={1.5}
                        pt={1.5}
                        sx={{ borderTop: "0.5px solid rgba(0,0,0,0.07)" }}
                      >
                        <Skeleton variant="text" width={50} />
                        <Skeleton variant="text" width={80} />
                      </Box>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          )}

          {/* Recommendation Cards */}
          {showRecommendations && !isLoading && recommendations.length > 0 && (
            <Fade in>
              <Grid container spacing={2}>
                {recommendations.map((game, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          borderColor: "#AFA9EC !important",
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: 1.25,
                          p: 2,
                          "&:last-child": { pb: 2 },
                        }}
                      >
                        {/* Name + Score */}
                        <Box
                          display="flex"
                          alignItems="flex-start"
                          justifyContent="space-between"
                          gap={1}
                        >
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            lineHeight={1.3}
                          >
                            {game.name || "N/A"}
                          </Typography>
                          {game.score && (
                            <Box
                              sx={{
                                minWidth: 44,
                                height: 26,
                                borderRadius: "6px",
                                backgroundColor: getScoreBg(game.score),
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: getScoreText(game.score),
                                }}
                              >
                                {game.score}%
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Recommendation reason */}
                        {game.reason && (
                          <Box
                            sx={{
                              p: 1.25,
                              borderRadius: "8px",
                              backgroundColor: darkMode
                                ? "rgba(174,169,236,0.08)"
                                : "#F5F4FF",
                              borderLeft: "2px solid #AFA9EC",
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              lineHeight={1.5}
                            >
                              {game.reason}
                            </Typography>
                          </Box>
                        )}

                        {/* Meta row */}
                        <Box display="flex" gap={2}>
                          {game.release_date && (
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <CalendarMonthIcon
                                sx={{ fontSize: 13, color: "text.disabled" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {game.release_date}
                              </Typography>
                            </Box>
                          )}
                          {game.reviews && (
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <ChatBubbleOutlineIcon
                                sx={{ fontSize: 13, color: "text.disabled" }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {game.reviews} reviews
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Tags */}
                        <Box display="flex" gap={0.75} flexWrap="wrap">
                          {game.genres &&
                            game.genres
                              .split(",")
                              .slice(0, 2)
                              .map((g, i) => (
                                <Chip
                                  key={i}
                                  label={g.trim()}
                                  size="small"
                                  sx={{
                                    height: 22,
                                    fontSize: 11,
                                    backgroundColor: darkMode
                                      ? "#0a2018"
                                      : "#E1F5EE",
                                    color: darkMode ? "#5EC4A8" : "#0F6E56",
                                    border: "none",
                                  }}
                                />
                              ))}
                          {game.tags &&
                            game.tags
                              .split(",")
                              .slice(0, 2)
                              .map((t, i) => (
                                <Chip
                                  key={i}
                                  label={t.trim()}
                                  size="small"
                                  sx={{
                                    height: 22,
                                    fontSize: 11,
                                    backgroundColor: darkMode
                                      ? "#1a1836"
                                      : "#EEEDFE",
                                    color: darkMode ? "#9B8FE8" : "#3C3489",
                                    border: "none",
                                  }}
                                />
                              ))}
                        </Box>

                        {/* Footer */}
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          mt="auto"
                          pt={1.25}
                          sx={{
                            borderTop: darkMode
                              ? "0.5px solid rgba(255,255,255,0.07)"
                              : "0.5px solid rgba(0,0,0,0.07)",
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <AttachMoneyIcon
                              sx={{ fontSize: 14, color: "text.secondary" }}
                            />
                            <Typography variant="body2" fontWeight={500}>
                              {game.price || "N/A"}
                            </Typography>
                          </Box>
                          {game.score && (
                            <Typography variant="caption" color="text.disabled">
                              {game.score >= 85
                                ? "⭐ Highly rated"
                                : game.score >= 70
                                  ? "Well rated"
                                  : "Mixed reviews"}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Fade>
          )}

          {/* Empty State */}
          {showRecommendations &&
            !isLoading &&
            recommendations.length === 0 && (
              <Fade in>
                <Card sx={{ p: 6, textAlign: "center" }}>
                  <SportsEsportsIcon
                    sx={{ fontSize: 48, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No recommendations found
                  </Typography>
                  <Typography variant="body2" color="text.disabled" mb={3}>
                    We couldn't find games similar to "{inputValue}". Try a
                    different title.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowRecommendations(false);
                      setInputValue("");
                      setSelectedGame("");
                    }}
                  >
                    Try another game
                  </Button>
                </Card>
              </Fade>
            )}

          {/* Initial empty state (before any search) */}
          {!showRecommendations && (
            <Fade in>
              <Card sx={{ p: 5, textAlign: "center", mt: 1 }}>
                <RocketLaunchIcon
                  sx={{ fontSize: 40, color: "text.disabled", mb: 1.5 }}
                />
                <Typography
                  variant="body1"
                  fontWeight={500}
                  color="text.secondary"
                >
                  Your recommendations will appear here
                </Typography>
              </Card>
            </Fade>
          )}
        </Container>

        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
