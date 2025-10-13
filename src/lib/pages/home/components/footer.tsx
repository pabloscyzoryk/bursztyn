// imports

// chakra-ui
import {
  Text,
  Box,
  Flex,
  VStack,
  Center,
  Icon,
  Portal,
  Dialog,
  CloseButton,
  Textarea,
  Spinner,
  Field,
  Input
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DiGithubBadge } from "react-icons/di";
import { FaInstagram } from "react-icons/fa";
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";

export const Footer = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [hasUserStartedTyping, setHasUserStartedTyping] = useState(false);

  useEffect(() => {
    if (name || email || message) {
      setHasUserStartedTyping(true);
    }
  }, [name, email, message]);

  useEffect(() => {
    if (hasUserStartedTyping) {
      setError("");
      setIsSuccess(false);
      setHasUserStartedTyping(false);
    }
  }, [name, email, message, hasUserStartedTyping]);

  useEffect(() => {
    emailjs.init({
      publicKey: "7prcEej_s0wj6KyHI",
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setIsPending(true);
    setIsSuccess(false);
    setHasUserStartedTyping(false); 

    try {
      await emailjs.sendForm(
        "service_pjp2ong_bursztyn",
        "template_8aw0nbd",
        formRef.current as HTMLFormElement
      );
      setName("");
      setEmail("");
      setMessage("");
      formRef.current?.reset();
      setIsSuccess(true);
    } catch (error: unknown) {
      console.log(error);
      setIsSuccess(false);
      if (error instanceof Error) {
        setError(error.message);
      }
      if (error instanceof EmailJSResponseStatus) {
        setError(error.text);
      } else {
        setError("Wystąpił nieznany błąd.");
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
    };

  return (
    <Flex
      p={6}
      justifyContent="center"
      alignItems="center"
      w="100vw"
      bg="gray.800"
      gap={8}
    >
      <Text color="white">Bursztyn by Paweł Cyrzyk 2025 &copy;</Text>

      <Flex gap={3} w={100} justifyContent="center" alignItems="center">
        <Link href="https://github.com/pabloscyzoryk/bursztyn">
          <Icon color="white" size="2xl">
            <DiGithubBadge />
          </Icon>
        </Link>
        <Link href="https://instagram.com/pabloscyzoryk">
          <Icon color="white" size="xl">
            <FaInstagram />
          </Icon>
        </Link>
      </Flex>
      <Dialog.Root motionPreset="slide-in-bottom">
        <Dialog.Trigger right="50px" position="absolute" asChild>
          <Button>Zgłoś błąd / napisz opinię</Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Napisz wiadomość dla autora</Dialog.Title>
              </Dialog.Header>
              <Box ref={formRef} onSubmit={(e) => handleSubmit(e)} as="form">
                <Dialog.Body>
                  <Field.Root orientation="vertical" flex="1" minW="0">
                    <Field.Label>Imię</Field.Label>
                    <Input
                      placeholder="Barbara"
                      flex="1"
                      fontSize={16}
                      resize="none"
                      type='text'
                      name='name'
                      value={name}
                      onChange={handleInputChange(setName)}
                    />
                  </Field.Root>
                  <Field.Root mt={3} orientation="vertical" flex="1" minW="0">
                    <Field.Label>Email</Field.Label>
                    <Input
                      placeholder="barbara.cyrzyk@gmail.com"
                      flex="1"
                      fontSize={16}
                      resize="none"
                      type='email'
                      name='email'
                      value={email}
                      onChange={handleInputChange(setEmail)}
                    />
                  </Field.Root>

                  <Field.Root mt={3} orientation="vertical" flex="1" minW="0">
                    <Field.Label>Wiadomość</Field.Label>
                    <Textarea
                      placeholder="Moja wiadomość / opinia / błąd..."
                      flex="1"
                      fontSize={16}
                      resize="both"
                      minH={200}
                      name='message'
                      value={message}
                      onChange={handleInputChange(setMessage)}
                    />
                  </Field.Root>

                  {error && <Text color="red.300">{error}</Text>}
                  {isSuccess && <Text color='green'>Wiadomość wysłana pomyślnie!</Text>}
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Anuluj</Button>
                  </Dialog.ActionTrigger>
                  {isPending ? (
                    <Button>
                      <Spinner color="white" />
                    </Button>
                  ) : (
                    <Button type="submit">Wyślij</Button>
                  )}
                </Dialog.Footer>
              </Box>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
};