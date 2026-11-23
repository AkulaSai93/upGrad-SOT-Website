"use client";

import Image from "next/image";
import { useRef, type ChangeEvent } from "react";
import { Camera, Globe, Mail, Phone, Upload, UserRound } from "lucide-react";
import { CITIES, STATES } from "@/components/site/india";
import {
  EMAIL_RE,
  PHONE_RE,
  PINCODE_RE,
  ageOn,
  type Address,
  type Profile,
  type StudentDetails,
} from "../application";
import {
  Checkbox,
  Field,
  Grid,
  SECONDARY_BUTTON,
  SectionCard,
  Select,
  TextInput,
} from "../fields";
import { GENDERS, NATIONALITIES, RELATIONSHIPS } from "../options";
import type { Errors, SectionProps } from "./types";

/**
 * The uGNET form's first section, Student Details: a photo, the student
 * (pre-filled from the details confirmed with the fee; the verified email
 * and number stay locked), a parent or guardian, and the current address,
 * with the permanent one asked for only when it is different.
 */

const blankAddress = (state = "", city = ""): Address => ({
  line1: "",
  line2: "",
  state,
  city,
  pincode: "",
});

/** the section's starting answers, from the confirmed details */
export function studentFrom(p: Profile): StudentDetails {
  const [first, ...rest] = p.name.trim().split(/\s+/);
  return {
    firstName: first ?? "",
    lastName: rest.join(" "),
    email: p.email,
    phone: p.phone,
    dob: p.dob,
    gender: "",
    state: p.state,
    city: p.city,
    nationality: "Indian",
    guardian: {
      firstName: "",
      lastName: "",
      relation: "",
      phone: "",
      email: "",
    },
    current: blankAddress(p.state, p.city),
    permanentSame: true,
    permanent: blankAddress(),
  };
}

function checkAddress(a: Address, at: string, e: Errors) {
  if (!a.line1.trim())
    e[`${at}.line1`] = "Enter the first line of the address.";
  if (!a.state) e[`${at}.state`] = "Select the state.";
  if (!a.city.trim()) e[`${at}.city`] = "Enter the city.";
  if (!PINCODE_RE.test(a.pincode))
    e[`${at}.pincode`] = "Enter a 6-digit pincode.";
}

export function checkStudent(s: StudentDetails): Errors {
  const e: Errors = {};
  if (!s.firstName.trim()) e.firstName = "Enter your first name.";
  if (!s.dob) e.dob = "Enter your date of birth.";
  else if (ageOn(s.dob) < 17) e.dob = "You must be 17 years or above.";
  if (!s.gender) e.gender = "Select your gender.";
  if (!s.state) e.state = "Select your state.";
  if (!s.city.trim()) e.city = "Enter your city.";
  if (!s.nationality) e.nationality = "Select your nationality.";
  const g = s.guardian;
  if (!g.firstName.trim()) e["guardian.firstName"] = "Enter their first name.";
  if (!g.lastName.trim()) e["guardian.lastName"] = "Enter their last name.";
  if (!g.relation)
    e["guardian.relation"] = "Select how they are related to you.";
  if (!PHONE_RE.test(g.phone))
    e["guardian.phone"] = "Enter a valid 10-digit mobile number.";
  if (!EMAIL_RE.test(g.email))
    e["guardian.email"] = "Enter a valid email address.";
  checkAddress(s.current, "current", e);
  if (!s.permanentSame) checkAddress(s.permanent, "permanent", e);
  return e;
}

/** scale a photo down to a small square JPEG, to keep it light to save */
function shrink(file: File, size = 320): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      canvas
        .getContext("2d")!
        .drawImage(
          img,
          (img.width - side) / 2,
          (img.height - side) / 2,
          side,
          side,
          0,
          0,
          size,
          size,
        );
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function PhotoPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (photo?: string) => void;
}) {
  const camera = useRef<HTMLInputElement>(null);
  const upload = useRef<HTMLInputElement>(null);
  const take = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file?.type.startsWith("image/")) onChange(await shrink(file));
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
      <span className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-full border border-black/[0.08] bg-sunken text-muted">
        {value ? (
          <Image
            src={value}
            alt="Your photo"
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <UserRound size={34} aria-hidden />
        )}
      </span>
      <div>
        <p className="text-[15px] font-semibold text-ink">
          {value ? "Your photo" : "Add your photo"}
        </p>
        <p className="mt-0.5 text-[13px] text-muted">
          A clear, front-facing photo in good light
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
          <button
            type="button"
            onClick={() => camera.current?.click()}
            className={`${SECONDARY_BUTTON} h-10 px-4 text-[13.5px]`}
          >
            <Camera size={16} aria-hidden />
            Take photo
          </button>
          <button
            type="button"
            onClick={() => upload.current?.click()}
            className={`${SECONDARY_BUTTON} h-10 px-4 text-[13.5px]`}
          >
            <Upload size={16} aria-hidden />
            {value ? "Change photo" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="h-10 px-2 text-[13.5px] font-medium text-body hover:text-accent"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={camera}
          type="file"
          accept="image/*"
          capture="user"
          onChange={take}
          className="sr-only"
          tabIndex={-1}
        />
        <input
          ref={upload}
          type="file"
          accept="image/*"
          onChange={take}
          className="sr-only"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}

function AddressFields({
  value,
  onChange,
  at,
  errors,
}: {
  value: Address;
  onChange: (a: Address) => void;
  at: string;
  errors: Errors;
}) {
  const set = (patch: Partial<Address>) => onChange({ ...value, ...patch });
  const err = (k: string) => errors[`${at}.${k}`];
  return (
    <Grid>
      <Field
        label="Address line 1"
        required
        htmlFor={`${at}-line1`}
        error={err("line1")}
        className="sm:col-span-2"
      >
        <TextInput
          id={`${at}-line1`}
          autoComplete="address-line1"
          placeholder="Flat no., floor, building"
          value={value.line1}
          invalid={Boolean(err("line1"))}
          onChange={(e) => set({ line1: e.target.value })}
        />
      </Field>
      <Field
        label="Address line 2"
        htmlFor={`${at}-line2`}
        className="sm:col-span-2"
      >
        <TextInput
          id={`${at}-line2`}
          autoComplete="address-line2"
          placeholder="Street, area, landmark"
          value={value.line2}
          onChange={(e) => set({ line2: e.target.value })}
        />
      </Field>
      <Field
        label="State"
        required
        htmlFor={`${at}-state`}
        error={err("state")}
      >
        <Select
          id={`${at}-state`}
          options={STATES}
          placeholder="Select state"
          value={value.state}
          invalid={Boolean(err("state"))}
          onChange={(e) => set({ state: e.target.value, city: "" })}
        />
      </Field>
      <Field label="City" required htmlFor={`${at}-city`} error={err("city")}>
        <TextInput
          id={`${at}-city`}
          list={`${at}-cities`}
          placeholder={
            value.state ? "Type or pick your city" : "Pick a state first"
          }
          disabled={!value.state}
          value={value.city}
          invalid={Boolean(err("city"))}
          onChange={(e) => set({ city: e.target.value })}
        />
        <datalist id={`${at}-cities`}>
          {(CITIES[value.state] ?? []).map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </Field>
      <Field
        label="Pincode"
        required
        htmlFor={`${at}-pin`}
        error={err("pincode")}
      >
        <TextInput
          id={`${at}-pin`}
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="6-digit pincode"
          value={value.pincode}
          invalid={Boolean(err("pincode"))}
          onChange={(e) =>
            set({ pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })
          }
        />
      </Field>
    </Grid>
  );
}

export function StudentSection({
  value: s,
  onChange,
  errors,
}: SectionProps<StudentDetails>) {
  const set = (patch: Partial<StudentDetails>) => onChange({ ...s, ...patch });
  const setGuardian = (patch: Partial<StudentDetails["guardian"]>) =>
    set({ guardian: { ...s.guardian, ...patch } });

  return (
    <div className="grid gap-6">
      <SectionCard
        title="Student details"
        line="Your name as it appears on your Class 12 marksheet"
      >
        <div className="grid gap-6">
          <PhotoPicker value={s.photo} onChange={(photo) => set({ photo })} />
          <Grid>
            <Field
              label="First name"
              required
              htmlFor="st-first"
              error={errors.firstName}
            >
              <TextInput
                id="st-first"
                icon={UserRound}
                autoComplete="given-name"
                placeholder="First name"
                value={s.firstName}
                invalid={Boolean(errors.firstName)}
                onChange={(e) => set({ firstName: e.target.value })}
              />
            </Field>
            <Field label="Last name" htmlFor="st-last">
              <TextInput
                id="st-last"
                icon={UserRound}
                autoComplete="family-name"
                placeholder="Last name"
                value={s.lastName}
                onChange={(e) => set({ lastName: e.target.value })}
              />
            </Field>
            <Field
              label="Email ID"
              hint="Verified with your application fee"
              htmlFor="st-email"
            >
              <TextInput id="st-email" icon={Mail} value={s.email} disabled />
            </Field>
            <Field
              label="Mobile number"
              hint="Verified when you signed in"
              htmlFor="st-phone"
            >
              <TextInput
                id="st-phone"
                icon={Phone}
                value={`+91 ${s.phone}`}
                disabled
              />
            </Field>
            <Field
              label="Date of birth"
              required
              hint="You must be 17 years or above"
              htmlFor="st-dob"
              error={errors.dob}
            >
              <TextInput
                id="st-dob"
                type="date"
                value={s.dob}
                invalid={Boolean(errors.dob)}
                onChange={(e) => set({ dob: e.target.value })}
              />
            </Field>
            <Field
              label="Gender"
              required
              hint="As on your documents"
              htmlFor="st-gender"
              error={errors.gender}
            >
              <Select
                id="st-gender"
                options={GENDERS}
                placeholder="Select gender"
                value={s.gender}
                invalid={Boolean(errors.gender)}
                onChange={(e) => set({ gender: e.target.value })}
              />
            </Field>
            <Field
              label="State"
              required
              htmlFor="st-state"
              error={errors.state}
            >
              <Select
                id="st-state"
                options={STATES}
                placeholder="Select state"
                value={s.state}
                invalid={Boolean(errors.state)}
                onChange={(e) => set({ state: e.target.value, city: "" })}
              />
            </Field>
            <Field label="City" required htmlFor="st-city" error={errors.city}>
              <TextInput
                id="st-city"
                list="st-cities"
                placeholder={
                  s.state ? "Type or pick your city" : "Pick a state first"
                }
                disabled={!s.state}
                value={s.city}
                invalid={Boolean(errors.city)}
                onChange={(e) => set({ city: e.target.value })}
              />
              <datalist id="st-cities">
                {(CITIES[s.state] ?? []).map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field
              label="Nationality"
              required
              htmlFor="st-nation"
              error={errors.nationality}
            >
              <div className="relative">
                <Globe
                  size={17}
                  aria-hidden
                  className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -translate-y-1/2 text-muted"
                />
                <Select
                  id="st-nation"
                  options={NATIONALITIES}
                  placeholder="Select nationality"
                  className="pl-10"
                  value={s.nationality}
                  invalid={Boolean(errors.nationality)}
                  onChange={(e) => set({ nationality: e.target.value })}
                />
              </div>
            </Field>
          </Grid>
        </div>
      </SectionCard>

      <SectionCard
        title="Parent / guardian details"
        line="Someone we can reach about your admission"
      >
        <Grid>
          <Field
            label="First name"
            required
            htmlFor="gd-first"
            error={errors["guardian.firstName"]}
          >
            <TextInput
              id="gd-first"
              icon={UserRound}
              placeholder="First name"
              value={s.guardian.firstName}
              invalid={Boolean(errors["guardian.firstName"])}
              onChange={(e) => setGuardian({ firstName: e.target.value })}
            />
          </Field>
          <Field
            label="Last name"
            required
            htmlFor="gd-last"
            error={errors["guardian.lastName"]}
          >
            <TextInput
              id="gd-last"
              icon={UserRound}
              placeholder="Last name"
              value={s.guardian.lastName}
              invalid={Boolean(errors["guardian.lastName"])}
              onChange={(e) => setGuardian({ lastName: e.target.value })}
            />
          </Field>
          <Field
            label="Relationship with student"
            required
            htmlFor="gd-rel"
            error={errors["guardian.relation"]}
          >
            <Select
              id="gd-rel"
              options={RELATIONSHIPS}
              placeholder="Select relationship"
              value={s.guardian.relation}
              invalid={Boolean(errors["guardian.relation"])}
              onChange={(e) => setGuardian({ relation: e.target.value })}
            />
          </Field>
          <Field
            label="Mobile number"
            required
            htmlFor="gd-phone"
            error={errors["guardian.phone"]}
          >
            <TextInput
              id="gd-phone"
              icon={Phone}
              type="tel"
              inputMode="numeric"
              placeholder="10-digit mobile number"
              value={s.guardian.phone}
              invalid={Boolean(errors["guardian.phone"])}
              onChange={(e) =>
                setGuardian({
                  phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                })
              }
            />
          </Field>
          <Field
            label="Email ID"
            required
            htmlFor="gd-email"
            error={errors["guardian.email"]}
            className="sm:col-span-2"
          >
            <TextInput
              id="gd-email"
              icon={Mail}
              type="email"
              placeholder="parent@example.com"
              value={s.guardian.email}
              invalid={Boolean(errors["guardian.email"])}
              onChange={(e) => setGuardian({ email: e.target.value.trim() })}
            />
          </Field>
        </Grid>
      </SectionCard>

      <SectionCard title="Current address" line="Where you live now">
        <div className="grid gap-6">
          <AddressFields
            value={s.current}
            onChange={(current) => set({ current })}
            at="current"
            errors={errors}
          />
          <div className="border-t border-black/[0.06] pt-5">
            <Checkbox
              checked={s.permanentSame}
              onChange={(permanentSame) => set({ permanentSame })}
            >
              My permanent address is the same as my current address
            </Checkbox>
          </div>
        </div>
      </SectionCard>

      {!s.permanentSame && (
        <SectionCard title="Permanent address" line="As on your ID documents">
          <AddressFields
            value={s.permanent}
            onChange={(permanent) => set({ permanent })}
            at="permanent"
            errors={errors}
          />
        </SectionCard>
      )}
    </div>
  );
}
