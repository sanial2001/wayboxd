-- CreateIndex
CREATE UNIQUE INDEX "places_external_source_external_id_key" ON "places"("external_source", "external_id");
