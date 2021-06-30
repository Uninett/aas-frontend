/**  * @jest-environment jsdom-sixteen  */

import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";

import api, { TimeRecurrence, Timeslot } from "../../api";
import TimeslotList from "./index";
import auth from "../../auth";

const apiMock = new MockAdapter(api.api);

const EXAMPLE_TIMESLOT_RECURRENCE_1: TimeRecurrence = {
  // eslint-disable-next-line
  all_day: false,
  start: "10:00:00",
  end: "12:00:00",
  days: [6, 7],
};

const EXAMPLE_TIMESLOT_RECURRENCE_2: TimeRecurrence = {
  // eslint-disable-next-line
  all_day: true,
  start: "12:00:00",
  end: "18:00:00",
  days: [5, 6, 7],
};

const recurrences: TimeRecurrence[] = [EXAMPLE_TIMESLOT_RECURRENCE_1];
const timeslot: Timeslot = {
  pk: 1,
  name: "Timeslot Test",
  // eslint-disable-next-line @typescript-eslint/camelcase
  time_recurrences: recurrences,
};

beforeAll(() => {
  auth.login("token");
});

afterAll(() => {
  auth.logout();
});

describe("TimeslotList: Initial render", () => {
  it("renders the timeslot page correctly", async () => {
    apiMock.onGet("/api/v1/notificationprofiles/timeslots/").reply(200, [timeslot]);
    render(<TimeslotList />);

    const title = screen.getByText(/create new timeslot/i);
    expect(title).toBeInTheDocument();

    const newTimeslot = screen.getByRole("form", { name: /new timeslot/i });
    expect(newTimeslot).toBeInTheDocument();

    const newTimeslotNameInput = within(newTimeslot).getByLabelText(/timeslot name/i);
    expect(newTimeslotNameInput).toBeInTheDocument();
    expect(newTimeslotNameInput).toHaveValue("");

    const newTimeslotCreateButton = within(newTimeslot).getByRole("button", { name: /create/i });
    expect(newTimeslotCreateButton).toBeInTheDocument();
    expect(newTimeslotCreateButton).toBeEnabled(); // TODO: should button be disabled before a name is specified?

    const newTimeslotDeleteButton = within(newTimeslot).getByRole("button", { name: /delete/i });
    expect(newTimeslotDeleteButton).toBeInTheDocument();
    expect(newTimeslotDeleteButton).toBeDisabled();

    const newTimeslotAddRecurrenceButton = within(newTimeslot).getByRole("button", { name: /add recurrence/i });
    expect(newTimeslotAddRecurrenceButton).toBeInTheDocument();
    expect(newTimeslotAddRecurrenceButton).toBeEnabled();

    const newTimeslotRemoveRecurrenceButton = within(newTimeslot).getByRole("button", { name: /remove/i });
    expect(newTimeslotRemoveRecurrenceButton).toBeInTheDocument();
    expect(newTimeslotRemoveRecurrenceButton).toBeEnabled();

    const newTimeslotAllDayCheckbox = within(newTimeslot).getByRole("checkbox");
    expect(newTimeslotAllDayCheckbox).toBeInTheDocument();
    expect(newTimeslotAllDayCheckbox).not.toBeChecked();

    const newTimeslotStartTimePicker = within(newTimeslot).getByRole("textbox", { name: /start time picker/i });
    expect(newTimeslotStartTimePicker).toBeInTheDocument();
    expect(newTimeslotStartTimePicker).toHaveValue("08:00");

    const newTimeslotEndTimePicker = within(newTimeslot).getByRole("textbox", { name: /end time picker/i });
    expect(newTimeslotEndTimePicker).toBeInTheDocument();
    expect(newTimeslotEndTimePicker).toHaveValue("16:00");

    const newTimeslotDaySelector = within(newTimeslot).getByRole("button", { name: /days/i });
    expect(newTimeslotDaySelector).toBeInTheDocument();
    expect(newTimeslotDaySelector).toBeEnabled();

    expect(within(newTimeslotDaySelector).getByText(/monday/i)).toBeInTheDocument();
    expect(within(newTimeslotDaySelector).getByText(/tuesday/i)).toBeInTheDocument();
    expect(within(newTimeslotDaySelector).getByText(/wednesday/i)).toBeInTheDocument();
    expect(within(newTimeslotDaySelector).getByText(/thursday/i)).toBeInTheDocument();
    expect(within(newTimeslotDaySelector).getByText(/friday/i)).toBeInTheDocument();
    expect(within(newTimeslotDaySelector).queryByText(/saturday/i)).toBeNull();
    expect(within(newTimeslotDaySelector).queryByText(/sunday/i)).toBeNull();

    const existingTimeslot = await screen.findByRole("form", { name: timeslot.name });
    expect(existingTimeslot).toBeInTheDocument();

    const existingTimeslotNameInput = within(existingTimeslot).getByLabelText(/timeslot name/i);
    expect(existingTimeslotNameInput).toBeInTheDocument();
    expect(existingTimeslotNameInput).toHaveValue(timeslot.name);

    const existingTimeslotSaveButton = within(existingTimeslot).getByRole("button", { name: /save/i });
    expect(existingTimeslotSaveButton).toBeInTheDocument();
    expect(existingTimeslotSaveButton).toBeDisabled();

    const existingTimeslotDeleteButton = within(existingTimeslot).getByRole("button", { name: /delete/i });
    expect(existingTimeslotDeleteButton).toBeInTheDocument();
    expect(existingTimeslotDeleteButton).toBeEnabled();

    const existingTimeslotAddRecurrenceButton = within(existingTimeslot).getByRole("button", {
      name: /add recurrence/i,
    });
    expect(existingTimeslotAddRecurrenceButton).toBeInTheDocument();
    expect(existingTimeslotAddRecurrenceButton).toBeEnabled();

    const existingTimeslotRemoveRecurrenceButton = within(existingTimeslot).getByRole("button", { name: /remove/i });
    expect(existingTimeslotRemoveRecurrenceButton).toBeInTheDocument();
    expect(existingTimeslotRemoveRecurrenceButton).toBeEnabled();

    const existingTimeslotAllDayCheckbox = within(existingTimeslot).getByRole("checkbox");
    expect(existingTimeslotAllDayCheckbox).toBeInTheDocument();
    expect(existingTimeslotAllDayCheckbox).not.toBeChecked();

    const existingTimeslotStartTimePicker = within(existingTimeslot).getByRole("textbox", {
      name: /start time picker/i,
    });
    expect(existingTimeslotStartTimePicker).toBeInTheDocument();
    expect(existingTimeslotStartTimePicker).toHaveValue("10:00");

    const existingTimeslotEndTimePicker = within(existingTimeslot).getByRole("textbox", {
      name: /end time picker/i,
    });
    expect(existingTimeslotEndTimePicker).toBeInTheDocument();
    expect(existingTimeslotEndTimePicker).toHaveValue("12:00");

    const existingTimeslotDaySelector = within(existingTimeslot).getByRole("button", { name: /days/i });
    expect(existingTimeslotDaySelector).toBeInTheDocument();
    expect(existingTimeslotDaySelector).toBeEnabled();

    expect(within(existingTimeslotDaySelector).queryByText(/monday/i)).toBeNull();
    expect(within(existingTimeslotDaySelector).queryByText(/tuesday/i)).toBeNull();
    expect(within(existingTimeslotDaySelector).queryByText(/wednesday/i)).toBeNull();
    expect(within(existingTimeslotDaySelector).queryByText(/thursday/i)).toBeNull();
    expect(within(existingTimeslotDaySelector).queryByText(/friday/i)).toBeNull();
    expect(within(existingTimeslotDaySelector).getByText(/saturday/i)).toBeInTheDocument();
    expect(within(existingTimeslotDaySelector).queryByText(/sunday/i)).toBeInTheDocument();
  });
});

describe("TimeslotList: Create new timeslot", () => {
  it("creates new timeslot successfully", async () => {
    apiMock
      .onGet("/api/v1/notificationprofiles/timeslots/")
      .reply(200, [timeslot])
      .onPost("/api/v1/notificationprofiles/timeslots/")
      // eslint-disable-next-line @typescript-eslint/camelcase
      .reply(201, { pk: 2, name: "Timeslot Test 2", time_recurrences: recurrences });

    render(<TimeslotList />);

    const createTimeslot = screen.getByRole("form", { name: /new timeslot/i });
    userEvent.type(within(createTimeslot).getByLabelText(/timeslot name/i), "Timeslot Test 2");
    userEvent.type(
      within(createTimeslot).getByRole("textbox", { name: /start time picker/i }),
      "{selectall}{backspace}12:30",
    );
    userEvent.type(
      within(createTimeslot).getByRole("textbox", { name: /end time picker/i }),
      "{selectall}{backspace}14:30",
    );

    userEvent.click(within(createTimeslot).getByRole("button", { name: /days/i }));
    userEvent.click(screen.getByRole("option", { name: /friday/i }));
    userEvent.click(within(createTimeslot).getByRole("button", { name: /create/i, hidden: true }));

    const successMessage = await screen.findByText(/created new timeslot/i);
    expect(successMessage).toBeInTheDocument();

    const newTimeslot2 = await screen.findByRole("form", { name: /timeslot test 2/i });
    expect(newTimeslot2).toBeInTheDocument();

    // TODO: check that registered values are correct?
  });

  it("fails to create new timeslot when name already exists", async () => {
    apiMock
      .onGet("/api/v1/notificationprofiles/timeslots/")
      .reply(200, [timeslot])
      .onPost("/api/v1/notificationprofiles/timeslots/")
      // eslint-disable-next-line @typescript-eslint/camelcase
      .reply(400);

    render(<TimeslotList />);

    const createTimeslot = screen.getByRole("form", { name: /new timeslot/i });
    userEvent.type(within(createTimeslot).getByLabelText(/timeslot name/i), timeslot.name);
    userEvent.click(within(createTimeslot).getByRole("button", { name: /create/i, hidden: true }));

    const errorMessage = await screen.findByText(/failed to post notificationprofile timeslot/i);
    expect(errorMessage).toBeInTheDocument();

    const timeslots = await screen.findAllByRole("form");
    expect(timeslots).toHaveLength(2);
  });
});

describe("TimeslotList: Update existing timeslot", () => {
  it("updates existing timeslot successfully", async () => {
    apiMock
      .onGet("/api/v1/notificationprofiles/timeslots/")
      .reply(200, [timeslot])
      .onPut("/api/v1/notificationprofiles/timeslots/1/")
      // eslint-disable-next-line @typescript-eslint/camelcase
      .reply(200, { pk: 1, name: "Timeslot Test 2", time_recurrences: recurrences });

    render(<TimeslotList />);

    const existingTimeslot = await screen.findByRole("form", { name: timeslot.name });

    const nameInput = within(existingTimeslot).getByLabelText(/timeslot name/i);
    userEvent.type(nameInput, "{selectall}{backspace}Timeslot Test 2");

    const startTimePicker = within(existingTimeslot).getByRole("textbox", { name: /start time picker/i });
    userEvent.type(startTimePicker, "{selectall}{backspace}12:30");

    const endTimePicker = within(existingTimeslot).getByRole("textbox", { name: /end time picker/i });
    userEvent.type(endTimePicker, "{selectall}{backspace}14:30");

    const daySelector = within(existingTimeslot).getByRole("button", { name: /days/i });
    userEvent.click(daySelector);

    const fridayOption = screen.getByRole("option", { name: /friday/i });
    userEvent.click(fridayOption);

    const saveButton = within(existingTimeslot).getByRole("button", { name: /save/i, hidden: true });
    userEvent.click(saveButton);

    const successMessage = await screen.findByText(/updated timeslot/i);
    expect(successMessage).toBeInTheDocument();

    const newTimeslot2 = await screen.findByRole("form", { name: /timeslot test 2/i });
    expect(newTimeslot2).toBeInTheDocument();

    // TODO: check that registered values are correct?
  }, 10000);

  it("fails to update existing timeslot when end time is invalid", async () => {
    apiMock
      .onGet("/api/v1/notificationprofiles/timeslots/")
      .reply(200, [timeslot])
      .onPut("/api/v1/notificationprofiles/timeslots/1/")
      // eslint-disable-next-line @typescript-eslint/camelcase
      .reply(400);

    render(<TimeslotList />);

    const existingTimeslot = await screen.findByRole("form", { name: timeslot.name });
    const endTimePicker = within(existingTimeslot).getByRole("textbox", { name: /end time picker/i });
    userEvent.type(endTimePicker, "{selectall}{backspace}08:00");

    const saveButton = within(existingTimeslot).getByRole("button", { name: /save/i });
    userEvent.click(saveButton);

    const errorMessage = await screen.findByText(/failed to put notificationprofile timeslot/i);
    expect(errorMessage).toBeInTheDocument();

    // TODO: check that value was not updated
  });
});

describe("TimeslotList: Delete existing timeslot", () => {
  it("deletes existing timeslot successfully", async () => {
    apiMock
      .onGet("/api/v1/notificationprofiles/timeslots/")
      .reply(200, [timeslot])
      .onDelete("/api/v1/notificationprofiles/timeslots/1/")
      // eslint-disable-next-line @typescript-eslint/camelcase
      .reply(204);

    render(<TimeslotList />);

    const existingTimeslot = await screen.findByRole("form", { name: timeslot.name });
    const deleteButton = within(existingTimeslot).getByRole("button", { name: /delete/i });
    userEvent.click(deleteButton);

    const successMessage = await screen.findByText(/deleted timeslot/i);
    expect(successMessage).toBeInTheDocument();

    const deletedTimeslot = screen.queryByRole("form", { name: timeslot.name });
    expect(deletedTimeslot).toBeNull();
  }, 10000);
});

describe("TimeslotList: Add/remove recurrences", () => {
  it("adds new recurrence to existing timeslot successfully", async () => {
    apiMock
      .onGet("/api/v1/notificationprofiles/timeslots/")
      .reply(200, [timeslot])
      .onPut("/api/v1/notificationprofiles/timeslots/1/")
      .reply(200, {
        pk: 1,
        name: "Timeslot Test",
        // eslint-disable-next-line @typescript-eslint/camelcase
        time_recurrences: [...recurrences, EXAMPLE_TIMESLOT_RECURRENCE_2],
      });

    render(<TimeslotList />);

    const existingTimeslot = await screen.findByRole("form", { name: timeslot.name });

    const addRecurrenceButton = within(existingTimeslot).getByRole("button", { name: /add recurrence/i });
    userEvent.click(addRecurrenceButton);

    // TODO: check that new recurrence is rendered before saving

    const saveButton = within(existingTimeslot).getByRole("button", { name: /save/i });
    userEvent.click(saveButton);

    const successMessage = await screen.findByText(/updated timeslot/i);
    expect(successMessage).toBeInTheDocument();

    const updatedTimeslot = await screen.findByRole("form", { name: timeslot.name });
    const removeButtons = within(updatedTimeslot).getAllByRole("button", { name: /remove/i });
    expect(removeButtons).toHaveLength(2);
    expect(removeButtons[1]).toBeInTheDocument();
    expect(removeButtons[0]).toBeInTheDocument();
  }, 100000);

  it("removes an existing recurrence from an existing timeslot successfully", async () => {
    apiMock
      .onGet("/api/v1/notificationprofiles/timeslots/")
      .reply(200, [timeslot])
      .onPut("/api/v1/notificationprofiles/timeslots/1/")
      .reply(200, {
        pk: 1,
        name: "Timeslot Test",
        // eslint-disable-next-line @typescript-eslint/camelcase
        time_recurrences: [],
      });

    render(<TimeslotList />);

    const existingTimeslot = await screen.findByRole("form", { name: timeslot.name });

    const removeRecurrenceButton = within(existingTimeslot).getByRole("button", { name: /remove/i });
    userEvent.click(removeRecurrenceButton);

    // TODO: check that recurrence is removed before saving

    const saveButton = within(existingTimeslot).getByRole("button", { name: /save/i });
    userEvent.click(saveButton);

    const successMessage = await screen.findByText(/updated timeslot/i);
    expect(successMessage).toBeInTheDocument();

    const updatedTimeslot = await screen.findByRole("form", { name: timeslot.name });
    const removeRecurrenceButton2 = within(updatedTimeslot).queryByRole("button", { name: /remove/i });
    expect(removeRecurrenceButton2).toBeNull();
  }, 100000);
});