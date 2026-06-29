import {
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    IconButton,
    Tooltip,
    Box,
} from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// color mapping for notification types
const typeColors = {
    Placement: "primary",
    Result: "success",
    Event: "secondary",
};

export function NotificationCard({ notification, onMarkRead, onDelete }) {
    const { _id, title, message, type, isRead, createdAt } = notification;

    // format the date in a readable way
    const formattedDate = new Date(createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <Card
            variant="outlined"
            sx={{
                opacity: isRead ? 0.75 : 1,
                borderLeft: isRead ? "3px solid transparent" : "3px solid #1976d2",
                transition: "all 0.2s ease",
                "&:hover": {
                    boxShadow: 2,
                    transform: "translateY(-1px)",
                },
            }}
        >
            <CardContent sx={{ pb: "12px !important" }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                >
                    <Box sx={{ flex: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                            {!isRead && (
                                <FiberManualRecordIcon
                                    sx={{ fontSize: 10, color: "primary.main" }}
                                />
                            )}
                            <Typography
                                variant="subtitle1"
                                fontWeight={isRead ? 400 : 600}
                                sx={{ lineHeight: 1.3 }}
                            >
                                {title}
                            </Typography>
                        </Stack>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1.5 }}
                        >
                            {message}
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Chip
                                label={type}
                                size="small"
                                color={typeColors[type] || "default"}
                                variant="outlined"
                            />
                            <Typography variant="caption" color="text.disabled">
                                {formattedDate}
                            </Typography>
                        </Stack>
                    </Box>

                    <Stack direction="row" spacing={0.5} sx={{ ml: 1 }}>
                        {!isRead && (
                            <Tooltip title="Mark as read">
                                <IconButton
                                    size="small"
                                    onClick={() => onMarkRead(_id)}
                                    color="primary"
                                >
                                    <MarkEmailReadIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="Delete">
                            <IconButton
                                size="small"
                                onClick={() => onDelete(_id)}
                                color="error"
                            >
                                <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}
