"use client";

import React from 'react';

import { Heading, Text, Flex, Button, Grid, Icon, InlineCode, Logo, Background, LetterFx, Arrow } from '@/once-ui/components';
import Link from 'next/link';
import { Header } from '@/once-ui/modules';


export default function Home() {
	
	return (
		<Flex
			fillWidth paddingTop="l" paddingX="l"
			direction="column" alignItems="center" flex={1}>
			<Header
  authenticated
  name="Scott"
  subline="Infinite Inc."
  avatar="https://www.gravatar.com/avatar/9e2119406791e5a06013aad60507cab75b5ae17e7b750986aa4f80ac3773ad5a"
/>
		</Flex>
	);
}
