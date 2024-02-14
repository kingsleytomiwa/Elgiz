import { Box, Typography } from "@mui/material";
import React from "react";
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'
import {
	format,
	parse,
	startOfWeek,
	getDay,
} from "date-fns";
import { ru, enGB, ro, tr, zhCN, fr, it, es, de } from 'date-fns/locale';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles.css";
import { RBCToolbar } from "./utils";
import { getSettingsDate } from "utils";
import { useTranslation } from "i18n";

type Event = {
	id: number;
	title: string;
	allDay?: boolean;
	start: Date;
	end: Date;
	color?: string;
};

type ScheduleProps = {
	events?: Event[];
	start?: string;
	end?: string;
	onEventClick?: (id: string) => void;
}

const Schedule = ({ events, end, start, onEventClick }: ScheduleProps) => {
	const [date, setDate] = React.useState(new Date())
	const [view, setView] = React.useState(Views.WEEK)
	const { i18n } = useTranslation({ ns: "portal" });

	const onNavigate = React.useCallback((newDate) => setDate(newDate), [setDate])
	const onView = React.useCallback((newView) => setView(newView), [setView])

	const localizer = dateFnsLocalizer({
		format,
		parse,
		startOfWeek,
		getDay,
		locales: {
			"ru": ru,
			"en": enGB,
			"ro": ro,
			"tr": tr,
			"zh": zhCN,
			"fr": fr,
			"it": it,
			"es": es,
			"de": de
		},
	});

	const { min, max, views } = React.useMemo(
		() => ({
			min: start ? getSettingsDate(start?.slice(0, 2)) : new Date(new Date().setHours(0, 0)),
			max: end ? getSettingsDate(end?.slice(0, 2)) : new Date(new Date().setHours(24, 0)),
			views: {
				week: true
			},
		}),
		[start, end]
	)

	return (
		<Box sx={{ height: "500px" }}>
			<>
				<Calendar
					events={events}
					localizer={localizer}
					showMultiDayTimes
					min={min}
					max={max}
					step={30}
					views={views}
					components={{
						toolbar: props => <RBCToolbar {...props} />,
						header: ({ date, localizer }) => <Typography sx={{ fontWeight: 700, lineHeight: "22px" }}>{localizer.format(date, "dd EEEEEE", i18n.language)}</Typography>,
						eventWrapper: (eventWrapperProps) => (
							<Box
								onClick={() => eventWrapperProps?.event?.id && onEventClick?.(eventWrapperProps.event.id as any)}
								sx={{
									"& .rbc-event": {
										backgroundColor: eventWrapperProps.event.color,
										border: "none",
									},
								}}
							>
								{/* @ts-ignore */}
								{eventWrapperProps.children}
							</Box>
						),
					}}
					date={date}
					view={view}
					onNavigate={onNavigate}
					onView={onView}
					culture={i18n.language}
				/>
			</>
		</Box>
	)
}

export default Schedule;