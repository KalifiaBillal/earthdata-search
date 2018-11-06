require 'spec_helper'

describe 'When viewing the project page with an OPeNDAP supported collection' do
  before :all do
    load_page :search, project: ['C1200187767-EDF_OPS', 'C1000000029-EDF_OPS'], env: :sit, authenticate: 'edsc'

    click_link('My Project')
    wait_for_xhr
  end

  it 'displays that collections support variable subsetting' do
    first_collection_card = find('.collection-card', match: :first)
    expect(first_collection_card).to have_css('.collection-capability i.fa.fa-tags', count: 1)
  end

  context 'When choosing to edit the collection' do
    before :all do
      collection_card = find('.collection-card', match: :first)

      collection_card.find('.edit').click
    end

    it 'displays the customization modal' do
      within '.collection-customization .modal-header' do
        expect(page).to have_content('Edit Options')
      end
    end

    it 'displays the variable selection button within the modal' do
      within '.collection-customization .modal-body' do
        expect(page).to have_button('Edit Variables')
      end
    end

    context 'When choosing to select variables' do
      before :all do
        find('.edit-variables').click
        wait_for_xhr
      end

      it 'displays the variable selection modal' do
        within '.variable-selection' do
          expect(page).to have_content('Variable Selection')
        end
        # wait_for_xhr
      end

      it 'displays a list of science keywords to choose from' do
        expect(page).to have_css('#associated-variables')
      end

      context 'When selecting a keyword to view its assigned variables' do
        before :all do
          within '#associated-variables' do
            find('li a', match: :first).click
          end
        end

        it 'shows a link to go back to view all keywords' do
          within '.selected-keyword' do
            expect(page).to have_link('All Leafnodes')
          end
        end

        it 'displays a select all option to select all variables' do
          within '.variable-list' do
            expect(page).to have_css('input.select-all[type="checkbox"]')
          end
        end

        it 'displays a button to save selected keywords' do
          within '.modal-footer .action-container' do
            expect(page).to have_button('Save')
          end
        end

        context 'When selecting a keyword and saving' do
          before :all do
            first('.collection-variable-list-item input[type="checkbox"]').set(true)

            within '.modal-footer' do
              click_button 'Save'
              wait_for_xhr
            end
          end

          it 'stores and displays the number of selected keywords' do
            within '#associated-variables:nth-child(1)' do
              expect(page).to have_content('1 selected')
            end
          end

          context 'When dismissing the variable selection modal' do
            before :all do
              within '.modal-footer' do
                click_button 'Done'
              end
            end

            it 'displays the selected variable in the project sidebar' do
              expect(page).to have_css('.selected-collection-variables > li', count: 1)
            end

            it 'displays that collection has variable subsetting' do
              first_collection_card = page.find('.collection-card', match: :first)
              expect(first_collection_card).to have_css('span.enabled i.fa.fa-tags')
            end
          end
        end
      end
    end
  end
end