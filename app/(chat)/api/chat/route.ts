import { Message, streamText } from "ai";
import { z } from "zod";

import { geminiProModel } from "@/ai";
import {
  generateReservationPrice,
  generateSampleFlightSearchResults,
  generateSampleFlightStatus,
  generateSampleSeatSelection,
} from "@/ai/actions";
import { auth } from "@/app/auth-stub";
import {
  createReservation,
  deleteChatById,
  getChatById,
  getReservationById,
  saveChat,
} from "@/db/queries-stub";
import { generateUUID } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { id, messages }: { id: string; messages: Array<Message> } =
      await request.json();

    const session = await auth();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

  // In AI SDK 5.x, messages are passed directly without conversion
  const filteredMessages = messages.filter(
    (message: Message) => message.content && message.content.length > 0,
  );

  const result = await streamText({
    model: geminiProModel,
    system: `You are a helpful assistant that responds to user messages.`,
    messages: filteredMessages,
    // Temporarily disable tools to test basic chat functionality
    /*tools: {
      getWeather: {
        description: "Get the current weather at a location",
        parameters: z.object({
          latitude: z.number().describe("Latitude coordinate"),
          longitude: z.number().describe("Longitude coordinate"),
        }),
        execute: async ({ latitude, longitude }) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
          );

          const weatherData = await response.json();
          return weatherData;
        },
      },
      displayFlightStatus: {
        description: "Display the status of a flight",
        parameters: z.object({
          flightNumber: z.string().describe("Flight number"),
          date: z.string().describe("Date of the flight"),
        }),
        execute: async ({ flightNumber, date }) => {
          const flightStatus = await generateSampleFlightStatus({
            flightNumber,
            date,
          });

          return flightStatus;
        },
      },
      searchFlights: {
        description: "Search for flights based on the given parameters",
        parameters: z.object({
          origin: z.string().describe("Origin airport or city"),
          destination: z.string().describe("Destination airport or city"),
        }),
        execute: async ({ origin, destination }) => {
          const results = await generateSampleFlightSearchResults({
            origin,
            destination,
          });

          return results;
        },
      },
      selectSeats: {
        description: "Select seats for a flight",
        parameters: z.object({
          flightNumber: z.string().describe("Flight number"),
        }),
        execute: async ({ flightNumber }) => {
          const seats = await generateSampleSeatSelection({ flightNumber });
          return seats;
        },
      },
      createReservation: {
        description: "Display pending reservation details",
        parameters: z.object({
          seats: z.string().array().describe("Array of selected seat numbers"),
          flightNumber: z.string().describe("Flight number"),
          departure: z.object({
            cityName: z.string().describe("Name of the departure city"),
            airportCode: z.string().describe("Code of the departure airport"),
            timestamp: z.string().describe("ISO 8601 date of departure"),
            gate: z.string().describe("Departure gate"),
            terminal: z.string().describe("Departure terminal"),
          }),
          arrival: z.object({
            cityName: z.string().describe("Name of the arrival city"),
            airportCode: z.string().describe("Code of the arrival airport"),
            timestamp: z.string().describe("ISO 8601 date of arrival"),
            gate: z.string().describe("Arrival gate"),
            terminal: z.string().describe("Arrival terminal"),
          }),
          passengerName: z.string().describe("Name of the passenger"),
        }),
        execute: async (props) => {
          const { totalPriceInUSD } = await generateReservationPrice(props);
          const session = await auth();

          const id = generateUUID();

          if (session && session.user && session.user.id) {
            await createReservation({
              id,
              userId: session.user.id,
              details: { ...props, totalPriceInUSD },
            });

            return { id, ...props, totalPriceInUSD };
          } else {
            return {
              error: "User is not signed in to perform this action!",
            };
          }
        },
      },
      authorizePayment: {
        description:
          "User will enter credentials to authorize payment, wait for user to repond when they are done",
        parameters: z.object({
          reservationId: z
            .string()
            .describe("Unique identifier for the reservation"),
        }),
        execute: async ({ reservationId }) => {
          return { reservationId };
        },
      },
      verifyPayment: {
        description: "Verify payment status",
        parameters: z.object({
          reservationId: z
            .string()
            .describe("Unique identifier for the reservation"),
        }),
        execute: async ({ reservationId }) => {
          const reservation = await getReservationById({ id: reservationId });

          if (reservation.hasCompletedPayment) {
            return { hasCompletedPayment: true };
          } else {
            return { hasCompletedPayment: false };
          }
        },
      },
      displayBoardingPass: {
        description: "Display a boarding pass",
        parameters: z.object({
          reservationId: z
            .string()
            .describe("Unique identifier for the reservation"),
          passengerName: z
            .string()
            .describe("Name of the passenger, in title case"),
          flightNumber: z.string().describe("Flight number"),
          seat: z.string().describe("Seat number"),
          departure: z.object({
            cityName: z.string().describe("Name of the departure city"),
            airportCode: z.string().describe("Code of the departure airport"),
            airportName: z.string().describe("Name of the departure airport"),
            timestamp: z.string().describe("ISO 8601 date of departure"),
            terminal: z.string().describe("Departure terminal"),
            gate: z.string().describe("Departure gate"),
          }),
          arrival: z.object({
            cityName: z.string().describe("Name of the arrival city"),
            airportCode: z.string().describe("Code of the arrival airport"),
            airportName: z.string().describe("Name of the arrival airport"),
            timestamp: z.string().describe("ISO 8601 date of arrival"),
            terminal: z.string().describe("Arrival terminal"),
            gate: z.string().describe("Arrival gate"),
          }),
        }),
        execute: async (boardingPass) => {
          return boardingPass;
        },
      },
    },*/
    onFinish: async ({ responseMessages }) => {
      if (session.user && session.user.id) {
        try {
          await saveChat({
            id,
            messages: [...filteredMessages, ...responseMessages],
            userId: session.user.id,
          });
        } catch (error) {
          console.error("Failed to save chat");
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  // In AI SDK 5.x, use toTextStreamResponse instead of toDataStreamResponse
  return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      message: error.message || 'Unknown error',
      stack: error.stack 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
