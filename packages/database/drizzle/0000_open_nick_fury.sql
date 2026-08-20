CREATE TYPE "public"."field_type_enum" AS ENUM('TEXT', 'NUMBER', 'EMAIL', 'YES_NO', 'PASSWORD');--> statement-breakpoint
CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar(400),
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "forms_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(100) NOT NULL,
	"label_key" varchar(100) NOT NULL,
	"placeholder" text,
	"is_required" boolean DEFAULT false NOT NULL,
	"type" "field_type_enum" NOT NULL,
	"index" numeric NOT NULL,
	"form_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "forms_fields_form_id_index_unique" UNIQUE("form_id","index")
);
--> statement-breakpoint
CREATE TABLE "forms_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"field_id" uuid NOT NULL,
	"value" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "forms_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"submitted_by" uuid,
	"answers" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(80) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text,
	"email_verified" boolean DEFAULT false,
	"profile_image_url" text,
	"refresh_token" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms_fields" ADD CONSTRAINT "forms_fields_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms_answers" ADD CONSTRAINT "forms_answers_submission_id_forms_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."forms_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms_answers" ADD CONSTRAINT "forms_answers_field_id_forms_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."forms_fields"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms_submissions" ADD CONSTRAINT "forms_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms_submissions" ADD CONSTRAINT "forms_submissions_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;