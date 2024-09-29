# Providers

## Overview

This directory contains the providers that are used to fetch the trips from the 3rd party API.

## How to create a new provider

To create a new provider, create a new class extending the TripProvider abstract class. The class should implement the methods of the abstract class, which are responsible for handling the API requests and responses.
The return value needs the same of interface declared in the abstract class.

After creating the provider, enabled with inserting it in `src/core/trips/trip-provider.factory.ts` and create a new key in `src/core/trips/types/provider.ts`
