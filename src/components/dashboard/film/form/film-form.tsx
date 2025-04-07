"use client";

import { Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileUploader } from "@/components/ui/file-uploader";
import { Separator } from "@/components/ui/separator";
import useFilmForm, { FormValues } from "@/hooks/use-film-form";
import { enumToOptions } from "@/lib/utils";
import { Genre } from "@prisma/client";
import { MultiSelect } from "@/components/ui/multi-select";
const genreOptions = enumToOptions(Genre);

export default function FilmForm({
  initialData,
}: {
  initialData: Partial<FormValues> | null;
}) {
  const { form, isSubmitting, onSubmit, addImageField, removeImageField } =
    useFilmForm({ initialData });

  return (
    <Card className="mx-auto w-full  mt-5 bg-[#1e1e1e] border border-[#333] text-white shadow-md">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Film Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Film Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter film description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Release Year */}
            <FormField
              control={form.control}
              name="releaseYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Year</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Genre (Comma separated or you can build a multi-select) */}
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <FormControl>
                    <MultiSelect
                      selected={field.value}
                      onChange={field.onChange}
                      options={genreOptions}
                      placeholder="Select genres"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Director */}
            <FormField
              control={form.control}
              name="director"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Director</FormLabel>
                  <FormControl>
                    <Input placeholder="Director Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cast (Comma separated list) */}
            <FormField
              control={form.control}
              name="cast"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cast</FormLabel>
                  <FormControl>
                    <Input placeholder="Actor 1, Actor 2, ..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="120" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Language */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Input placeholder="English, Spanish" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="USA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rating */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="8.5"
                      step="0.1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Featured */}
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-3">
                    <span>Featured</span>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Poster Images */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <FormLabel className="text-base">Poster Images</FormLabel>
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  size="sm"
                  onClick={addImageField}
                  disabled={form.watch("posterUrl").length >= 5}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
              </div>
              <div className="space-y-4">
                {/* File Uploader for File objects */}
                <FormField
                  control={form.control}
                  name="posterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUploader
                          value={field.value.filter(
                            (item) => item instanceof File
                          )}
                          onValueChange={(files) => {
                            const urlImages = field.value.filter(
                              (item) => typeof item === "string"
                            );
                            field.onChange([...urlImages, ...files]);
                          }}
                          maxFiles={5}
                          accept={{ "image/*": [] }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* URL Inputs for already-uploaded images */}
                {form
                  .watch("posterUrl")
                  .map((image: string | File, index: number) => {
                    if (image instanceof File) return null;
                    return (
                      <div key={index} className="flex gap-3">
                        <FormField
                          control={form.control}
                          name={`posterUrl.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <div className="flex">
                                  <div className="bg-muted p-2 flex items-center rounded-l-md border border-r-0 border-input">
                                    <Upload className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <Input
                                    required
                                    placeholder="https://example.com/image.jpg"
                                    className="rounded-l-none"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeImageField(index)}
                          disabled={form.watch("posterUrl").length <= 2}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 text-red-100" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    );
                  })}
              </div>
            </div>

            <Separator />

            {/* Trailer URL */}
            <FormField
              control={form.control}
              name="trailerUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trailer URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/trailer.mp4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Video URL */}
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/video.mp4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Submitting..."
                  : initialData
                  ? "Update Film"
                  : "Create Film"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
